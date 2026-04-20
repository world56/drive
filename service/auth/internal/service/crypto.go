package service

import (
	"context"
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/pem"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type CryptoService struct {
	redis *redis.Client
}

func NewCryptoService(r *redis.Client) *CryptoService {
	return &CryptoService{
		redis: r,
	}
}

type RSAKeyPair struct {
	Public  string `redis:"public"`
	Private string `redis:"private"`
}

// 生成密钥
func (s *CryptoService) getRSA() (*RSAKeyPair, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}
	privateKeyDER, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		return nil, err
	}
	privatePEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PRIVATE KEY",
		Bytes: privateKeyDER,
	})
	publicKey := &privateKey.PublicKey
	publicKeyDER, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		return nil, err
	}
	publicPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyDER,
	})
	return &RSAKeyPair{
		Public:  string(publicPEM),
		Private: string(privatePEM),
	}, nil
}

// 解密
func (s *CryptoService) Decrypt(c context.Context, token string) ([]byte, error) {
	privateKey, err := s.redis.HGet(c, "drive:rsa", "private").Result()
	if err != nil {
		return nil, err
	}

	cipherText, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return nil, errors.New("base64 decode error")
	}

	block, _ := pem.Decode([]byte(privateKey))
	if block == nil {
		return nil, errors.New("failed to parse PEM block")
	}

	priv, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	rsaPriv, ok := priv.(*rsa.PrivateKey)
	if !ok {
		return nil, errors.New("not an rsa private key")
	}

	hash := sha256.New()
	return rsa.DecryptOAEP(hash, rand.Reader, rsaPriv, cipherText, nil)
}

func (s *CryptoService) GetKey(c *gin.Context) (string, error) {
	public, _ := s.redis.HGet(c, "drive:rsa", "public").Result()
	if len(public) > 0 {
		return public, nil
	}
	key, err := s.getRSA()
	s.redis.HSet(c, "drive:rsa", key).Result()
	if err != nil {
		return "", errors.New("generation failure")
	}
	return key.Public, nil
}

func (s *CryptoService) md5(str string) string {
	bytes := md5.Sum([]byte(str))
	text := hex.EncodeToString(bytes[:])
	return text
}

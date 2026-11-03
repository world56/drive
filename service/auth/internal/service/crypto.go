package service

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"

	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type CryptoService struct {
	redis *redis.Client
}

func newCryptoService(r *redis.Client) *CryptoService {
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

	return rsa.DecryptPKCS1v15(rand.Reader, rsaPriv, cipherText)
}

func (s *CryptoService) getPublicKey(c context.Context) (string, error) {
	public, err := s.redis.HGet(c, "drive:rsa", "public").Result()
	if err == nil {
		return public, nil
	}
	if errors.Is(err, redis.Nil) {
		return "", nil
	}
	return "", err
}

func (s *CryptoService) GetKey(c context.Context) (string, error) {
	public, err := s.getPublicKey(c)
	if err != nil {
		return "", err
	}
	if public != "" {
		return public, nil
	}

	key, err := s.getRSA()
	if err != nil {
		return "", errors.New("generation failure")
	}

	err = s.redis.Watch(c, func(tx *redis.Tx) error {
		existing, err := tx.HGet(c, "drive:rsa", "public").Result()
		if err == nil && existing != "" {
			public = existing
			return nil
		}
		if err != nil && !errors.Is(err, redis.Nil) {
			return err
		}

		_, err = tx.TxPipelined(c, func(pipe redis.Pipeliner) error {
			pipe.HSet(c, "drive:rsa", "public", key.Public, "private", key.Private)
			return nil
		})
		if err != nil {
			return err
		}
		public = key.Public
		return nil
	}, "drive:rsa")
	if errors.Is(err, redis.TxFailedErr) {
		public, err = s.getPublicKey(c)
	}
	if err != nil {
		return "", err
	}
	if public == "" {
		return "", errors.New("generation failure")
	}
	return public, nil
}

func (s *CryptoService) HashPassword(password string) (string, error) {
	if len(password) == 0 {
		return "", errors.New("password is empty")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

func (s *CryptoService) VerifyPassword(password string, encodedHash string) (bool, error) {
	if len(password) == 0 || len(encodedHash) == 0 {
		return false, nil
	}

	err := bcrypt.CompareHashAndPassword([]byte(encodedHash), []byte(password))
	if err == nil {
		return true, nil
	}
	if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
		return false, nil
	}
	return false, err
}

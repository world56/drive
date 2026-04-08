package utils

import (
	"crypto/sha256"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
)

type RSAKeyPair struct {
	Public  string `redis:"public"`
	Private string `redis:"private"`
}

// 生成RSA
func GetKey() (*RSAKeyPair, error) {
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
func Decrypt(privateKeyPEM string, token string) ([]byte, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return nil, errors.New("base64 decode error")
	}

	block, _ := pem.Decode([]byte(privateKeyPEM))
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
	return rsa.DecryptOAEP(hash, rand.Reader, rsaPriv, ciphertext, nil)
}

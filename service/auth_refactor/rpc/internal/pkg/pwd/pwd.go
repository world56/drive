package pwd

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	if len(password) == 0 {
		return "", errors.New("password is empty")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

func VerifyPassword(password string, encodedHash string) (bool, error) {
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

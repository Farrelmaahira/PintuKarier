package usecase

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net/url"
	"strconv"
	"time"
)

// SignUpload query "exp" dan "sig" untuk URL PUT /files/{key}. Browser upload
// langsung tanpa token sesi; tanda tangan mengikat key dan masa berlaku.
func SignUpload(secret, key string, exp time.Time) url.Values {
	e := strconv.FormatInt(exp.Unix(), 10)
	return url.Values{"exp": {e}, "sig": {uploadSig(secret, key, e)}}
}

// VerifyUpload tolak tanda tangan salah atau kedaluwarsa.
func VerifyUpload(secret, key, exp, sig string, now time.Time) error {
	if !hmac.Equal([]byte(sig), []byte(uploadSig(secret, key, exp))) {
		return errors.New("tanda tangan upload tidak valid")
	}
	e, err := strconv.ParseInt(exp, 10, 64)
	if err != nil || now.Unix() > e {
		return errors.New("link upload kedaluwarsa, minta link baru")
	}
	return nil
}

func uploadSig(secret, key, exp string) string {
	mac := hmac.New(sha256.New, []byte("upload:"+secret))
	mac.Write([]byte("PUT\n" + key + "\n" + exp))
	return hex.EncodeToString(mac.Sum(nil))
}

package auth

import (
	"time"

	inst "github.com/hailocab/h2/go/i/instrumentation"
)

func instTiming(key string, err error, t time.Time) {
	if err == nil {
		key += ".success"
	} else {
		key += ".failure"
	}
	inst.Timing(1.0, key, time.Since(t))
}

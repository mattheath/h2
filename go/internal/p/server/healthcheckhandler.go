package server

import (
	"github.com/hailocab/protobuf/proto"

	"github.com/hailocab/h2/go/internal/p/errors"
	"github.com/hailocab/h2/go/internal/p/healthcheck"
)

// healthHandler handles inbound requests to `health` endpoint
func healthHandler(req *Request) (proto.Message, errors.Error) {
	return healthcheck.Status(), nil
}

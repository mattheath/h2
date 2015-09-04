package server

import (
	"github.com/hailocab/protobuf/proto"

	"github.com/hailocab/h2/go/internal/p/errors"
	"github.com/hailocab/h2/go/i/config"

	loadedconfigproto "github.com/hailocab/h2/go/internal/p/proto/loadedconfig"
)

// loadedConfigHandler handles inbound requests to `loadedconfig` endpoint
func loadedConfigHandler(req *Request) (proto.Message, errors.Error) {
	configJson := string(config.Raw())
	return &loadedconfigproto.Response{
		Config: proto.String(configJson),
	}, nil
}

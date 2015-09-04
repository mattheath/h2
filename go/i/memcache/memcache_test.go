package memcache

import (
	"bytes"
	"net"
	"testing"

	platformtesting "github.com/hailocab/h2/go/internal/p/testing"
	"github.com/hailocab/h2/go/i/config"
	"github.com/hailocab/h2/go/i/dns"
)

func TestMemcacheHostsSuite(t *testing.T) {
	platformtesting.RunSuite(t, new(MemcacheHostsSuite))
}

type MemcacheHostsSuite struct {
	platformtesting.Suite
	mockResolver *dns.MockResolver
	realResolver dns.Resolver
}

func (s *MemcacheHostsSuite) SetupTest() {
	s.Suite.SetupTest()
	s.mockResolver = &dns.MockResolver{}
	s.realResolver = dns.DefaultResolver
	dns.DefaultResolver = s.mockResolver
}

func (s *MemcacheHostsSuite) TearDownTest() {
	s.Suite.TearDownTest()
	dns.DefaultResolver = s.realResolver
	config.Load(bytes.NewBufferString("{}"))
}

func (s *MemcacheHostsSuite) TestGetHostsNoConfig() {
	s.mockResolver.Register(
		"memcached",
		[]net.IP{net.ParseIP("10.0.0.1")},
		nil,
	)
	hosts := getHosts()

	s.Len(hosts, 1)
	s.Equal(hosts[0], "10.0.0.1:11211")
}

func (s *MemcacheHostsSuite) TestGetHostsServersInConfig() {
	buf := bytes.NewBufferString(`{
		"hailo": {
			"service": {
				"memcache":{
					"servers": ["10.0.0.1:11211"]
				}
			}
		}
	}`)
	config.Load(buf)

	hosts := getHosts()

	s.Len(hosts, 1)
	s.Equal(hosts[0], "10.0.0.1:11211")
}

func (s *MemcacheHostsSuite) TestGetHostsTierInConfig() {
	buf := bytes.NewBufferString(`{
		"hailo": {
			"service": {
				"memcache":{
					"tier": "my-tier"
				}
			}
		}
	}`)
	config.Load(buf)

	s.mockResolver.Register(
		"memcached-my-tier",
		[]net.IP{net.ParseIP("10.0.0.1")},
		nil,
	)
	hosts := getHosts()

	s.Len(hosts, 1)
	s.Equal(hosts[0], "10.0.0.1:11211")
}

func (s *MemcacheHostsSuite) TestGetHostsTierAndServersInConfig() {
	buf := bytes.NewBufferString(`{
		"hailo": {
			"service": {
				"memcache":{
					"tier": "my-tier",
					"servers": {
						"my-tier": ["10.0.0.1:11211"]
					}
				}
			}
		}
	}`)
	config.Load(buf)

	hosts := getHosts()

	s.Len(hosts, 1)
	s.Equal(hosts[0], "10.0.0.1:11211")
}

import { describe, expect, it } from "vitest";
import { validateImageTarget } from "./policy";

describe("图片代理目标校验", () => {
  it.each([
    "ftp://example.com/a",
    "file:///etc/passwd",
    "not a url",
    "http://localhost/a",
    "http://a.localhost/a",
    "http://LOCALHOST./a",
    "https://editor.example/a",
    "https://editor.example.:443/a",
    "https://user:password@example.com/a",
    "http://127.1/a",
    "http://2130706433/a",
    "http://0x7f000001/a",
    "http://[::ffff:127.0.0.1]/a",
  ])("拒绝不合法或受限 URL：%s", (url) => {
    expect(() => validateImageTarget(url, "editor.example:3000")).toThrowError(
      "INVALID_ADDRESS"
    );
  });
  it.each([
    "127.0.0.1",
    "127.255.255.255",
    "10.0.0.1",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "0.0.0.0",
    "0.12.3.4",
    "::",
    "::1",
    "fc00::1",
    "fdff::1",
    "fe80::1",
    "febf::1",
    "::ffff:192.168.1.1",
    "::ffff:8.8.8.8",
    "0:0:0:0:0:ffff:0808:0808",
    "100.64.0.1",
    "224.0.0.1",
    "255.255.255.255",
    "not-an-ip",
  ])("拒绝受限解析地址：%s", (address) => {
    expect(() =>
      validateImageTarget("https://images.example/a", "editor.example", [
        address,
      ])
    ).toThrowError("INVALID_ADDRESS");
  });
  it("拒绝混合公网与私网 DNS 答案、无 DNS 答案", () => {
    expect(() =>
      validateImageTarget("https://images.example/a", "editor.example", [
        "8.8.8.8",
        "10.0.0.1",
      ])
    ).toThrowError("INVALID_ADDRESS");
    expect(() =>
      validateImageTarget("https://images.example/a", "editor.example", [])
    ).toThrowError("INVALID_ADDRESS");
  });
  it("允许公网地址和最多三跳重定向，每跳仍拒绝私网和自身", () => {
    expect(
      validateImageTarget(
        "https://images.example/a",
        "editor.example",
        ["93.184.216.34", "2606:4700:4700::1111"],
        3
      ).hostname
    ).toBe("images.example");
    expect(() =>
      validateImageTarget(
        "https://images.example/a",
        "editor.example",
        ["8.8.8.8"],
        4
      )
    ).toThrowError("FETCH_DENIED");
    expect(() =>
      validateImageTarget("http://10.0.0.1/a", "editor.example", undefined, 1)
    ).toThrowError("INVALID_ADDRESS");
    expect(() =>
      validateImageTarget(
        "https://editor.example/a",
        "editor.example",
        undefined,
        2
      )
    ).toThrowError("INVALID_ADDRESS");
  });
});

it.each([
  "http://[::1]/",
  "http://images.example:8080/a",
  "https://images.example:22/a",
  "http://[2001:db8::]/",
  "http://[2002::]/",
  "http://[2001:0::]/",
  "http://[64:ff9b::]/",
])("拒绝保留 IPv6 与非标准端口 %s", (url) => {
  expect(() => validateImageTarget(url, "editor.example")).toThrow(
    "INVALID_ADDRESS"
  );
});

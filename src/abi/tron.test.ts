import { ChainApi } from "../ChainApi";
import { getBalance, getBalances } from "../eth/index";

jest.setTimeout(20000);

const intercroneFactory = 'TPvaMEL5oY2gWsJv7MDjNQh2dohwvwwVwx'
const tronPair = 'TW1gkyFAHstM33MJVk6tmKdcaPKkD2G4MG'
const tUSDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const tronApi = new ChainApi({ chain: 'tron' })

test("call tron address 0x", async () => {
  expect(
    await tronApi.call({
      target: "0xa614f803b6fd780986a42c78ec9c7f77e6ded13c",
      abi: "erc20:decimals",
    })
  ).toEqual("6");
});

test("call tron address TR...", async () => {
  expect(
    await tronApi.call({
      target: tUSDT,
      abi: "erc20:decimals",
    })
  ).toEqual("6");
});

test("tron call: get token balance", async () => {
  expect(
    await tronApi.call({
      target: tUSDT,
      params: intercroneFactory,
      abi: "erc20:balanceOf",
    })
  ).toEqual("0");
});

test("tron call: uniswap methods", async () => {
  expect(
    +await tronApi.call({
      target: intercroneFactory,
      abi: "uint256:allPairsLength",
    })
  ).toBeGreaterThan(50);
  expect(
    await tronApi.call({
      target: intercroneFactory,
      abi: "function allPairs(uint256) view returns (address)",
      params: [1]
    })
  ).toEqual(tronPair);
});

test("multicall: tron", async () => {
  expect(
    await tronApi.multiCall({
      target: intercroneFactory,
      abi: "function allPairs(uint256) view returns (address)",
      calls: [0, 1, 2, 3, 4]
    })
  ).toEqual(["TGnK2w6vWX9dTL7ZsbXAarvc1CVujv9os8", tronPair, "TPT5yEpBxtS18cEGpRkkrBAANB4pD79ERT", "TF7ALfmpZeMhQhzJK8JXfhghrH7Exk2gkx", "TXemHTu125mZqubnibGPXrbgqKe89nV2Dv"]);
});

test("tron: getBalance", async () => {
  expect(
    await getBalance({
      chain: 'tron',
      target: intercroneFactory,
    })
  ).toEqual({ "output": "0" });
});

test("tron: getBalances", async () => {
  const res = await getBalances({
    chain: 'tron',
    targets: [intercroneFactory, tronPair],
  })
  expect(res).toEqual({
    "output": [
      { "target": intercroneFactory, "balance": "0" },
      { "target": tronPair, "balance": "498" },
    ]
  })
});
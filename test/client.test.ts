import { Principal } from "@dfinity/principal";
import { IcNamingClient } from "../src";

jest.mock("../src/internal/base");

const dummyPrincipal = Principal.fromText("crp26-tyaaa-aaaam-aacbq-cai");

describe("IcNamingClient", () => {
  it("should naming available", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { available: () => {} } as any;

    jest
      .spyOn(client["registrar"], "available")
      .mockResolvedValue({ Ok: true });

    await expect(client.isAvailableNaming("naming")).resolves.toBeTruthy();
    expect(client["registrar"].available).toBeCalledTimes(1);
  });

  it("should return expired time", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { get_name_expires: () => {} } as any;

    jest
      .spyOn(client["registrar"], "get_name_expires")
      .mockResolvedValue({ Ok: BigInt(123) });

    await expect(client.getExpiredTimeOfName("name")).resolves.toBe(
      BigInt(123)
    );
    expect(client["registrar"].get_name_expires).toBeCalledTimes(1);
  });

  it("should return names of registrant", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { get_names: () => {} } as any;

    jest.spyOn(client["registrar"], "get_names").mockResolvedValue({
      Ok: {
        items: [
          {
            name: "name1",
            created_at: BigInt(123),
            expired_at: BigInt(456),
          },
        ],
      },
    });

    await expect(
      client.getNamesOfRegistrant(dummyPrincipal, {
        offset: BigInt(0),
        limit: BigInt(100),
      })
    ).resolves.toMatchObject([
      {
        name: "name1",
        created_at: BigInt(123),
        expired_at: BigInt(456),
      },
    ]);
    expect(client["registrar"].get_names).toBeCalledTimes(1);
  });

  it("should return names of controller", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registry"] = { get_controlled_names: () => {} } as any;

    jest.spyOn(client["registry"], "get_controlled_names").mockResolvedValue({
      Ok: {
        items: ["name1", "name2", "name3"],
      },
    });

    await expect(
      client.getNamesOfController(dummyPrincipal, {
        offset: BigInt(0),
        limit: BigInt(100),
      })
    ).resolves.toMatchObject(["name1", "name2", "name3"]);
    expect(client["registry"].get_controlled_names).toBeCalledTimes(1);
  });

  it("should return registrant of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { get_owner: () => {} } as any;

    jest.spyOn(client["registrar"], "get_owner").mockResolvedValue({
      Ok: dummyPrincipal,
    });

    await expect(client.getRegistrantOfName("name")).resolves.toBe(
      dummyPrincipal
    );
    expect(client["registrar"].get_owner).toBeCalledTimes(1);
  });

  it("should return controller of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registry"] = { get_owner: () => {} } as any;

    jest.spyOn(client["registry"], "get_owner").mockResolvedValue({
      Ok: dummyPrincipal,
    });

    await expect(client.getControllerOfName("name")).resolves.toBe(
      dummyPrincipal
    );
    expect(client["registry"].get_owner).toBeCalledTimes(1);
  });

  it("should return resolver of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registry"] = { get_resolver: () => {} } as any;

    jest.spyOn(client["registry"], "get_resolver").mockResolvedValue({
      Ok: dummyPrincipal,
    });

    await expect(client.getResolverOfName("name")).resolves.toBe(
      dummyPrincipal
    );
    expect(client["registry"].get_resolver).toBeCalledTimes(1);
  });

  it("should return registration detail of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { get_details: () => {} } as any;

    jest.spyOn(client["registrar"], "get_details").mockResolvedValue({
      Ok: {
        owner: dummyPrincipal,
        name: "name",
        created_at: BigInt(123),
        expired_at: BigInt(456),
      },
    });

    await expect(client.getRegistrationOfName("name")).resolves.toMatchObject({
      owner: dummyPrincipal,
      name: "name",
      created_at: BigInt(123),
      expired_at: BigInt(456),
    });
    expect(client["registrar"].get_details).toBeCalledTimes(1);
  });

  it("should return records of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["resolver"] = { get_record_value: () => {} } as any;

    jest.spyOn(client["resolver"], "get_record_value").mockResolvedValue({
      Ok: [
        ["key1", "value1"],
        ["key2", "value2"],
        ["key3", "value3"],
      ],
    });

    await expect(client.getRecordsOfName("name")).resolves.toMatchObject([
      ["key1", "value1"],
      ["key2", "value2"],
      ["key3", "value3"],
    ]);
    expect(client["resolver"].get_record_value).toBeCalledTimes(1);
  });

  it("should return registry of name", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registry"] = { get_details: () => {} } as any;

    jest.spyOn(client["registry"], "get_details").mockResolvedValue({
      Ok: {
        ttl: BigInt(600),
        resolver: dummyPrincipal,
        owner: dummyPrincipal,
        name: "name",
      },
    });

    await expect(client.getRegistryOfName("name")).resolves.toMatchObject({
      ttl: BigInt(600),
      resolver: dummyPrincipal,
      owner: dummyPrincipal,
      name: "name",
    });
    expect(client["registry"].get_details).toBeCalledTimes(1);
  });
});

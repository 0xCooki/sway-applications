/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.31.0
  Forc version: 0.32.2
  Fuel-Core version: 0.17.1
*/

import type {
  Interface,
  FunctionFragment,
  DecodedValue,
  Contract,
  BytesLike,
  BigNumberish,
  InvokeFunction,
  BN,
} from 'fuels';

import type { Option, Enum } from "./common";

export type InitErrorInput = Enum<{ BytecodeRootAlreadySet: [], BytecodeRootDoesNotMatch: [], BytecodeRootNotSet: [], PairDoesNotDefinePool: [] }>;
export type InitErrorOutput = InitErrorInput;

export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type RegisterPoolEventInput = { asset_pair: [ContractIdInput, ContractIdInput], pool: ContractIdInput };
export type RegisterPoolEventOutput = { asset_pair: [ContractIdOutput, ContractIdOutput], pool: ContractIdOutput };
export type SetExchangeBytecodeRootEventInput = { root: string };
export type SetExchangeBytecodeRootEventOutput = SetExchangeBytecodeRootEventInput;

interface AMMContractAbiInterface extends Interface {
  functions: {
    add_pool: FunctionFragment;
    initialize: FunctionFragment;
    pool: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'add_pool', values: [[ContractIdInput, ContractIdInput], ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'initialize', values: [ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'pool', values: [[ContractIdInput, ContractIdInput]]): Uint8Array;

  decodeFunctionData(functionFragment: 'add_pool', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'initialize', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'pool', data: BytesLike): DecodedValue;
}

export class AMMContractAbi extends Contract {
  interface: AMMContractAbiInterface;
  functions: {
    add_pool: InvokeFunction<[asset_pair: [ContractIdInput, ContractIdInput], pool: ContractIdInput], void>;
    initialize: InvokeFunction<[exchange_bytecode_root: ContractIdInput], void>;
    pool: InvokeFunction<[asset_pair: [ContractIdInput, ContractIdInput]], Option<ContractIdOutput>>;
  };
}
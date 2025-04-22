import { Option } from "../option";

export interface Header<T> extends Option<T> {
  key: string;
  name: React.ReactNode | string;
  sort?: boolean;
  tooltip?: React.ReactNode | string;
}

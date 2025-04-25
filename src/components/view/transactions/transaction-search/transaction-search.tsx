import React, { useCallback, useState } from "react";
import { TransactionSearchWrapper } from "./transaction-search.styles";
import { MainInput } from "@/components/ui/input";
import { debounce } from "@/common/utils/string-util";

const TransactionSearch: React.FC = () => {
  const [keyword, setKeyword] = useState("");

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(setKeyword(e.target.value), 1000);
    },
    [keyword],
  );

  const clearValue = () => {
    setKeyword("");
  };

  return (
    <TransactionSearchWrapper>
      <MainInput
        className="main-search"
        value={keyword}
        setValue={setKeyword}
        onChange={onChange}
        clearValue={clearValue}
        placeholder="Search by Tx hash only when using a custom RPC. To get full support, connect your Tx Indexer URL."
      />
    </TransactionSearchWrapper>
  );
};

export default TransactionSearch;

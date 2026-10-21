import React from "react";

import Datatable from "@/components/ui/datatable";

// TODO: wire up real API for this tab
export const PlaceholderDatatable = () => {
  return <Datatable headers={[]} datas={null} supported={false} />;
};

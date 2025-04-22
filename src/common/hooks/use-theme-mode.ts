import { themeState } from "@/states";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export const useThemeMode = () => {
  const themeMode = useRecoilValue(themeState);

  const isDark = useMemo(() => {
    return themeMode === "dark";
  }, [themeMode]);

  const isLight = useMemo(() => {
    return themeMode !== "dark";
  }, [themeMode]);

  return { isDark, isLight };
};

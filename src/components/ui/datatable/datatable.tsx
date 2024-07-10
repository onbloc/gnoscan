import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {DatatableData, DatatableHeader} from '.';
import IconTabelLoading from '@/assets/svgs/icon-table-loading.svg';
import {zindex} from '@/common/values/z-index';

interface Props<T> {
  maxWidth?: number;
  headers: Array<DatatableHeader.Header<T>>;
  datas: Array<T>;
  supported?: boolean;
  loading?: boolean;
  sortOption?: {field: string; order: string};
  setSortOption?: (sortOption: {field: any; order: any}) => void;
  renderDetails?: (data: T) => React.ReactNode;
}

export const Datatable = <T extends {[key in string]: any}>({
  headers,
  datas,
  maxWidth,
  sortOption,
  loading,
  supported = true,
  setSortOption,
  renderDetails,
}: Props<T>) => {
  const datatableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onHandleHideTooltips();
    datatableRef.current?.addEventListener('scroll', onHandleHideTooltips);
    return () => {
      datatableRef.current?.removeEventListener('scroll', onHandleHideTooltips);
    };
  }, [datatableRef]);

  const onHandleHideTooltips = () => {
    window?.dispatchEvent(new Event('resize'));
  };

  return (
    <Container maxWidth={maxWidth} ref={datatableRef}>
      <div className="scroll-wrapper">
        <DatatableHeader.HeaderRow
          headers={headers}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        {loading && (
          <div className="loading-wrapper">
            <IconTabelLoading />
          </div>
        )}
        {!loading && datas?.length > 0 && (
          <DatatableData.DataList headers={headers} datas={datas} renderDetails={renderDetails} />
        )}
        {!loading && datas?.length === 0 && supported && (
          <div className="no-content-wrapper">
            <span>{'No data to display'}</span>
          </div>
        )}
        {!loading && datas?.length === 0 && !supported && (
          <div className="no-content-wrapper">
            <span>{'Not Supported'}</span>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div<{maxWidth?: number}>`
  ::-webkit-scrollbar {
    width: 0px;
    display: none;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  & {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 20px 24px;
    background-color: ${({theme}) => theme.colors.base};
    border-radius: 10px;
    overflow-x: auto;

    .scroll-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: ${({maxWidth}) => (maxWidth ? `${maxWidth}px` : '1146px')};
      z-index: ${zindex.scrollbar};
    }

    @keyframes rotating {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }

    .loading-wrapper {
      display: flex;
      width: 100%;
      min-height: 284px;
      justify-content: center;
      align-items: center;

      svg {
        animation: rotating 2s linear infinite;
      }

      stop {
        stop-color: ${({theme}) => theme.colors.surface};
      }

      circle {
        fill: ${({theme}) => theme.colors.surface};
      }
    }

    .no-content-wrapper {
      display: flex;
      width: 100%;
      min-height: 100px;
      justify-content: center;
      align-items: center;

      span {
        color: ${({theme}) => theme.colors.tertiary};
        font-weight: 400;
      }
    }

    .time,
    .fee {
      padding: 16px 0 16px 8px;
    }

    .functions {
      padding: 16px 0 16px 16px;
    }
  }
`;

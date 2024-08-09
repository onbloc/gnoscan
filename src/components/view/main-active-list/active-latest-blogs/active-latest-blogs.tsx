import React, {useCallback} from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import ActiveList from '@/components/ui/active-list';
import {colWidth, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import IconLink from '@/assets/svgs/icon-link.svg';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {getLocalDateString} from '@/common/utils/date-util';
import styled from 'styled-components';
import {useUpdateTime} from '@/common/hooks/main/use-update-time';
import {useLatestBlogs} from '@/common/hooks/main/use-latest-blogs';
import {Publisher} from '../../datatable/item';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {useUsername} from '@/common/hooks/account/use-username';
import {useGetBlogPublisher} from '@/common/hooks/common/use-get-board';

const ActiveLatestBlogs = () => {
  const media = eachMedia();
  const {isFetched, updatedAt} = useUpdateTime();
  const {data: blogs, isFetched: blogsFetched} = useLatestBlogs();

  const getBlogUrl = useCallback((path: string) => {
    return 'https://gno.land' + path;
  }, []);

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Latest Blogs
        {media !== 'mobile' && blogsFetched && isFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(updatedAt)}`}
          </Text>
        )}
      </Text>
      {blogsFetched ? (
        <ActiveList title={listTitle.blogs} colWidth={colWidth.blogs}>
          {blogs?.map(blog => (
            <List key={blog.index}>
              <StyledText type="p4" width={colWidth.blogs[0]} color="tertiary">
                {blog.index + 1}
              </StyledText>
              <StyledTitleWrapper width={colWidth.blogs[1]}>
                <a href={getBlogUrl(blog.path)} target="_blank" rel="noreferrer">
                  <StyledText
                    width={colWidth.blogs[1]}
                    type="p4"
                    color="blue"
                    className="with-link">
                    <Tooltip content={blog.title}>
                      <span className="ellipsis-text">{blog.title}</span>
                    </Tooltip>
                    <IconLink className="icon-link" />
                  </StyledText>
                </a>
              </StyledTitleWrapper>
              <LazyBlogPublisher path={blog.path} />
            </List>
          ))}
          {blogs && blogs.length === 0 && (
            <StyledContentWrapper>
              <StyledText width="fit-content" type="p4" color="tertiary">
                No data to display
              </StyledText>
            </StyledContentWrapper>
          )}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}

      {media === 'mobile' && blogsFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(updatedAt)}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveLatestBlogs;

const LazyBlogPublisher: React.FC<{path: string}> = ({path}) => {
  const {data: address, isFetched} = useGetBlogPublisher(path);
  const {isFetched: isFetchedUsername, getName} = useUsername();

  if (!isFetched || !isFetchedUsername) {
    return <SkeletonBar />;
  }

  return (
    <StyledText type="p4" width={colWidth.blogs[2]} color="blue">
      <Publisher
        address={address || undefined}
        username={address ? getName(address) : undefined}></Publisher>
    </StyledText>
  );
};

const StyledContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledTitleWrapper = styled.div<{width: string}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  a {
    display: flex;
    width: fit-content;
    max-width: ${({width}) => width};
    justify-content: flex-start;
    align-items: flex-start;

    .ellipsis-text {
      display: block;
      width: fit-content;
      max-width: ${({width}) => `calc(${width} - 50px)`};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

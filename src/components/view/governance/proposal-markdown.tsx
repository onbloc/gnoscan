import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import styled from "styled-components";

interface ProposalMarkdownProps {
  description: string;
  gnoWebUrl: string | null;
}

const ProposalMarkdown = ({ description, gnoWebUrl }: ProposalMarkdownProps) => {
  const safeUrl = (value: string) => {
    if (!value) return undefined;
    try {
      const url = gnoWebUrl ? new URL(value, gnoWebUrl) : new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
    } catch {
      return undefined;
    }
  };

  return (
    <MarkdownBody>
      <ReactMarkdown
        skipHtml
        rehypePlugins={[rehypeSanitize]}
        urlTransform={safeUrl}
        components={{
          a: ({ href, children }) =>
            href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <span>{children}</span>
            ),
          img: ({ src, alt }) =>
            src ? <img src={src} alt={alt || ""} loading="lazy" referrerPolicy="no-referrer" /> : <span>{alt}</span>,
        }}
      >
        {description}
      </ReactMarkdown>
    </MarkdownBody>
  );
};

export default ProposalMarkdown;

const MarkdownBody = styled.div`
  width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.p4};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0 12px;
    font-weight: 600;
  }
  h1 {
    ${({ theme }) => theme.fonts.h2};
  }
  h2 {
    ${({ theme }) => theme.fonts.h3};
  }
  h3 {
    ${({ theme }) => theme.fonts.h4};
  }
  h4,
  h5,
  h6 {
    ${({ theme }) => theme.fonts.h6};
  }
  > :first-child {
    margin-top: 0;
  }
  > :last-child {
    margin-bottom: 0;
  }
  p,
  ul,
  ol,
  blockquote,
  pre {
    margin: 0 0 12px;
  }
  ul,
  ol {
    padding-left: 24px;
  }
  ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }
  li {
    margin-bottom: 4px;
  }
  ul ul {
    list-style: circle;
  }
  strong {
    font-weight: 600;
  }
  em {
    font-style: italic;
  }
  a {
    color: ${({ theme }) => theme.colors.blue};
  }
  code {
    padding: 2px 5px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.dimmed50};
  }
  pre {
    padding: 12px;
    overflow-x: auto;
  }
  pre code {
    padding: 0;
  }
  blockquote {
    padding-left: 12px;
    border-left: 3px solid ${({ theme }) => theme.colors.dimmed200};
    color: ${({ theme }) => theme.colors.tertiary};
  }
  img {
    max-width: 100%;
    height: auto;
  }
`;

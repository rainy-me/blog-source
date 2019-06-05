import React from "react"
import Link from "gatsby-link"
import { graphql } from "gatsby"
import styled from "styled-components"
import { animated } from "react-spring"
import { Transition } from "react-spring/renderprops"
import Layout from "../../components/layout"
import PostSummary from "./summay"
import GradientFont from "../../components/common/gradientFont"
import PostPagination from "./pagination"
const Content = styled.div`
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`

const PostsTitle = styled.h1`
  font-size: 5rem;
  margin-bottom: 1rem;
`
const PostCount = styled.p`
  color: #777;
`
export default function Posts({ data, pageContext }) {
  const nodes = data.allMarkdownRemark.edges.map(({ node }) => node)

  return (
    <Layout>
      <Content>
        <PostsTitle>
          <GradientFont>Posts</GradientFont>
        </PostsTitle>

        <PostCount>
          这人很懒 一共才写了
          {data.pageCount.edges.length}
          篇文章
        </PostCount>

        <ul>
          <Transition
            items={nodes}
            keys={node => node.id}
            from={{ opacity: 0, transform: "translateY(40px)" }}
            enter={{ opacity: 1, transform: "translateY(0px)" }}
            leave={{ opacity: 0, transform: "translateY(40px)" }}
          >
            {node => style => (
              <animated.li style={style}>
                <Link to={node.fields.slug}>
                  <PostSummary detail={node.frontmatter} />
                </Link>
              </animated.li>
            )}
          </Transition>
        </ul>

        <PostPagination pageContext={pageContext} />
      </Content>
    </Layout>
  )
}

export const query = graphql`
  query postArchiveQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/posts/" } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            tags
          }
          fields {
            slug
          }
        }
      }
    }
    pageCount: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" } }
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`
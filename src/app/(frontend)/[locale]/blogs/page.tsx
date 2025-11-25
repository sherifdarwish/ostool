import LocaleLink from '@/components/shared/LocaleLink'
import { Button } from '@/components/ui/button'
import { getPayload } from '@/lib/payload'
import { cn } from '@/utilities/ui'
import Image from 'next/image'

// Loader function for next/image to handle custom image sources

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    limit: 0,
    pagination: false,
    where: {
      publishedAt: { not_equals: null },
    },
    locale: locale as 'en' | 'ar',
    sort: '-publishedAt',
    depth: 2,
    overrideAccess: true,
  })

  const blogPageData = await payload.findGlobal({
    slug: 'blog-page',
    depth: 2,
    locale: locale as 'en' | 'ar',
    overrideAccess: true,
  })

  // const blogPageData = {
  //   id: 1,

  //   hero: {
  //     title: 'Recent Articles from Our Blog',
  //     description:
  //       'The Nafes Blog is the go-to resource for ambitious entrepreneurs, offering reliable and comprehensive content that clarifies the complete administrative process of bidding. It highlights key requirements, instructions, laws, and regulations while providing practical advice and leading economic trends to enhance your chances of winning tender',

  //     image: {
  //       id: 14,
  //       alt: null,
  //       caption: null,
  //       updatedAt: '2025-09-16T21:47:34.486Z',
  //       createdAt: '2025-09-16T21:47:34.486Z',
  //       url: '/api/media/file/banner-1.svg',
  //       thumbnailURL: null,
  //       filename: 'banner-1.svg',
  //       mimeType: 'image/svg+xml',
  //       filesize: 605942,
  //       width: 1000,
  //       height: 714,
  //       focalX: null,
  //       focalY: null,

  //       sizes: {
  //         thumbnail: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         square: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         small: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         medium: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         large: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         xlarge: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         og: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },
  //       },
  //     },
  //   },

  //   featuredPost: {
  //     id: 1,
  //     title:
  //       'Everything you need to know about the bidding system in commercial competitions with Nafis',
  //     slug: 'system-in-commercial-competitions',
  //     'Short Description':
  //       "Are you competing in a live auction for a chance to win? Learn all about the bidding system, learn about the types of electronic bidding, and how to develop a winning strategy with Navis's comprehensive guide.",
  //     heroTag: 'new',

  //     heroImage: {
  //       id: 18,
  //       alt: 'waiting',
  //       caption: null,
  //       updatedAt: '2025-09-16T23:01:28.702Z',
  //       createdAt: '2025-09-16T23:01:28.702Z',
  //       url: '/api/media/file/waiting-ar.webp',
  //       thumbnailURL: '/api/media/file/waiting-ar-300x301.webp',
  //       filename: 'waiting-ar.webp',
  //       mimeType: 'image/webp',
  //       filesize: 19736,
  //       width: 473,
  //       height: 475,
  //       focalX: 50,
  //       focalY: 50,

  //       sizes: {
  //         thumbnail: {
  //           url: '/api/media/file/waiting-ar-300x301.webp',
  //           width: 300,
  //           height: 301,
  //           mimeType: 'image/webp',
  //           filesize: 11752,
  //           filename: 'waiting-ar-300x301.webp',
  //         },

  //         square: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         small: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         medium: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         large: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         xlarge: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },

  //         og: {
  //           url: null,
  //           width: null,
  //           height: null,
  //           mimeType: null,
  //           filesize: null,
  //           filename: null,
  //         },
  //       },
  //     },
  //     publishedAt: '2025-09-02T18:00:00.000Z',

  //     author: {
  //       id: 1,
  //       name: 'Khalid Umar',
  //       updatedAt: '2025-09-17T14:30:09.409Z',
  //       createdAt: '2025-09-16T18:11:58.715Z',
  //       email: 'admin@admin.com',

  //       sessions: [
  //         {
  //           id: 'cd0ab51c-3650-4669-b5bf-37ac25465ba9',
  //           createdAt: '2025-09-17T14:30:09.409Z',
  //           expiresAt: '2025-09-17T16:30:09.409Z',
  //         },
  //       ],
  //     },

  //     content: {
  //       root: {
  //         type: 'root',
  //         format: '',
  //         indent: 0,
  //         version: 1,

  //         children: [
  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'When public institutions in the Kingdom of Saudi Arabia wish to purchase a specific commodity or obtain services or work, they resort to issuing tenders. Conversely, if the institution needs to sell an asset or service, it resorts to the government auction system, which is conducted via a set of dedicated official electronic platforms.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h2',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Auction system ',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'An auction is a sales event in which potential buyers bid competitively to purchase assets or services. This is usually done either in a public manner, open to anyone who wants to enter the auction and propose a price, or in a closed manner. ',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Auctions are a popular method of selling because both the buyer and seller believe they are getting a good deal when buying or selling assets. Examples of auctions include cattle markets where farmers buy and sell animals, car auctions, real estate auctions, and auctions of art, antiques, and other items.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h2',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Types of electronic auctions',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: "Electronic auction platforms are among the most prominent technologies that keep pace with the Kingdom of Saudi Arabia's technological progress. They effectively contribute to achieving the Kingdom's goals, which are based on the principles of transparency, openness, and equal opportunity. Here are the types of electronic auctions:",
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h3',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Hybrid Auction',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: ' This type of auction combines both in-person and virtual auctions. It is held in a dedicated hall, with the opportunity to participate remotely (via mobile phone or computer) to follow the auction process via live broadcast. To achieve this, in-person and virtual bids are monitored simultaneously, allowing participants to compete and the auction is decided in favor of the highest bidder at the end of the specified time.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h3',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Virtual Auction',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Bidders and others can watch the live broadcast of the auctioneer or the auctioneer and bid on the item being auctioned. In this type of auction, attendance at the auction is limited to the auctioneer, while other participants are free to participate remotely.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h2',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Auction mechanism',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Auctions are divided into public and closed auctions. In a public auction, all bidders are able to see the bids submitted publicly, while in a closed auction, bids submitted are confidential. Bidders are not permitted to see the bids of others.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Auctions are usually conducted directly or through an official electronic platform, and in all cases, the offered asset or service is sold to the party who submits the highest bid at the public auction. The same usually applies to closed auctions.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'h2',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Bidding System Standards ',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'The outcome of auctions is subject to many factors and criteria that affect the auction, as follows:',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             tag: 'ul',
  //             type: 'list',
  //             start: 1,
  //             format: '',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 type: 'listitem',
  //                 value: 1,
  //                 format: 'start',
  //                 indent: 0,
  //                 version: 1,

  //                 children: [
  //                   {
  //                     mode: 'normal',
  //                     text: 'Supply and Demand: ',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 1,
  //                     version: 1,
  //                   },

  //                   {
  //                     mode: 'normal',
  //                     text: 'Products and assets in high demand are more likely to fetch a high price, while less-demanding items are subject to fewer bids. However, in general, auctions offer quicker sales and are more efficient than traditional auctions.',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 0,
  //                     version: 1,
  //                   },
  //                 ],
  //                 direction: 'ltr',
  //                 textFormat: 1,
  //               },

  //               {
  //                 type: 'listitem',
  //                 value: 2,
  //                 format: 'start',
  //                 indent: 0,
  //                 version: 1,

  //                 children: [
  //                   {
  //                     mode: 'normal',
  //                     text: 'Product quality: ',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 1,
  //                     version: 1,
  //                   },

  //                   {
  //                     mode: 'normal',
  //                     text: 'Product quality enhances its price value. The better the quality of the item, the more incentive it gives bidders to bid higher than the expected price.',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 0,
  //                     version: 1,
  //                   },
  //                 ],
  //                 direction: 'ltr',
  //                 textFormat: 1,
  //               },

  //               {
  //                 type: 'listitem',
  //                 value: 3,
  //                 format: 'start',
  //                 indent: 0,
  //                 version: 1,

  //                 children: [
  //                   {
  //                     mode: 'normal',
  //                     text: 'Payment and Transfer of Ownership: ',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 1,
  //                     version: 1,
  //                   },

  //                   {
  //                     mode: 'normal',
  //                     text: 'Favorable payment terms and timely transfer of ownership are a significant influence on purchase intent, which directly impacts competition and purchasing.',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 0,
  //                     version: 1,
  //                   },
  //                 ],
  //                 direction: 'ltr',
  //                 textFormat: 1,
  //               },
  //             ],
  //             listType: 'bullet',
  //             direction: 'ltr',
  //           },

  //           {
  //             tag: 'h2',
  //             type: 'heading',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'The difference between tender and auction ',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'Although the laws governing auctions and tenders are similar, with some minor differences, the objectives of each type are entirely different. In tenders, a government entity issues ',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },

  //               {
  //                 id: '68c9e9a11801f364c41e8733',
  //                 type: 'link',

  //                 fields: {
  //                   url: 'https://nafes.ai/blogs/%D9%85%D8%A7-%D9%87%D9%8A-%D8%A7%D9%84%D9%85%D9%86%D8%A7%D9%82%D8%B5%D8%A9',
  //                   newTab: true,
  //                   linkType: 'custom',
  //                 },
  //                 format: '',
  //                 indent: 0,
  //                 version: 3,

  //                 children: [
  //                   {
  //                     mode: 'normal',
  //                     text: 'a public tender',
  //                     type: 'text',
  //                     style: '',
  //                     detail: 0,
  //                     format: 0,
  //                     version: 1,
  //                   },
  //                 ],
  //                 direction: 'ltr',
  //               },

  //               {
  //                 mode: 'normal',
  //                 text: ' when it requires the completion of specific public projects or the supply of public utilities. In this process, the entity aims to select the best bid—that is, the one offering the lowest price and highest quality.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: "An auction is used by a company's management when it wishes to sell or lease a portion of its real estate or property. It is conducted as part of an organized and smooth process aimed at obtaining the highest possible value from the sums offered. In other words, the offer with the highest price is chosen.",
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },

  //           {
  //             type: 'paragraph',
  //             format: 'start',
  //             indent: 0,
  //             version: 1,

  //             children: [
  //               {
  //                 mode: 'normal',
  //                 text: 'The auction system is an ideal method for selling in the Saudi market, with a number of factors that can positively influence it, such as offering at the right time and the scarcity of the product, or negatively, such as customer saturation with the product in a specific location or weak purchasing power.',
  //                 type: 'text',
  //                 style: '',
  //                 detail: 0,
  //                 format: 0,
  //                 version: 1,
  //               },
  //             ],
  //             direction: 'ltr',
  //             textStyle: '',
  //             textFormat: 0,
  //           },
  //         ],
  //         direction: 'ltr',
  //       },
  //     },

  //     relatedPosts: [],

  //     seo: {
  //       title: '',
  //       image: null,
  //       description: null,
  //     },
  //     updatedAt: '2025-09-17T15:23:15.070Z',
  //     createdAt: '2025-09-16T21:47:58.072Z',
  //   },
  //   moreArticlesTitle: 'More Articles',
  //   featurePostButtonText: 'Continue Reading',
  //   updatedAt: '2025-09-17T15:22:16.460Z',
  //   createdAt: '2025-09-16T21:48:15.933Z',
  //   globalType: 'blog-page',
  // }

  console.log('feature post image url:', blogPageData?.featuredPost)

  return (
    <section>
      <section className="container mt-10">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="sm:my-[60px] my-[0px]">
            <h1 className="sm:text-[62px] text-[40px] font-bold leading-[1.3] mt-[1em]">
              {blogPageData?.hero?.title}
            </h1>
            <p className="text-[18px] leading-[1.7] text-[#374151] mt-[25px]">
              {blogPageData?.hero?.description}
            </p>
          </div>
          <div>
            <img
              src={
                typeof blogPageData?.hero?.image === 'string'
                  ? blogPageData.hero.image
                  : typeof blogPageData?.hero?.image === 'object' &&
                      blogPageData?.hero?.image !== null &&
                      'url' in blogPageData.hero.image &&
                      typeof blogPageData.hero.image.url === 'string'
                    ? blogPageData.hero.image.url
                    : ''
              }
              alt="bp"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="max-h-[340px]">
            <img
              src={
                blogPageData?.featuredPost &&
                typeof blogPageData.featuredPost === 'object' &&
                blogPageData.featuredPost !== null &&
                'heroImage' in blogPageData.featuredPost &&
                blogPageData.featuredPost.heroImage &&
                typeof blogPageData.featuredPost.heroImage === 'object' &&
                'url' in blogPageData.featuredPost.heroImage &&
                typeof blogPageData.featuredPost.heroImage.url === 'string'
                  ? blogPageData.featuredPost.heroImage.url
                  : '/placeholder.png'
              }
              alt={
                typeof blogPageData.featuredPost === 'object' &&
                blogPageData.featuredPost !== null &&
                'heroImage' in blogPageData.featuredPost &&
                blogPageData.featuredPost.heroImage &&
                typeof blogPageData.featuredPost.heroImage === 'object' &&
                'alt' in blogPageData.featuredPost.heroImage
                  ? (blogPageData.featuredPost.heroImage.alt ?? 'banner')
                  : 'banner'
              }
              className="w-full object-cover"
            />
          </div>
          <div>
            <p className="#555a65">
              {typeof blogPageData.featuredPost === 'object' &&
              blogPageData.featuredPost !== null &&
              'publishedAt' in blogPageData.featuredPost &&
              blogPageData.featuredPost.publishedAt
                ? new Date(blogPageData.featuredPost.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </p>
            <h3 className="text-[30px] font-bold text-[#2b2d33]">
              {typeof blogPageData.featuredPost === 'object' &&
              blogPageData.featuredPost !== null &&
              'title' in blogPageData.featuredPost
                ? blogPageData.featuredPost.title
                : ''}
            </h3>
            <p className="my-[28px] text-[#666]">
              {typeof blogPageData.featuredPost === 'object' &&
              blogPageData.featuredPost !== null &&
              'Short Description' in blogPageData.featuredPost
                ? blogPageData.featuredPost['Short Description']
                : ''}
            </p>
            <LocaleLink
              href={
                typeof blogPageData?.featuredPost === 'object' &&
                blogPageData.featuredPost !== null &&
                'slug' in blogPageData.featuredPost &&
                typeof blogPageData.featuredPost.slug === 'string'
                  ? `/blogs/${blogPageData.featuredPost.slug}`
                  : '#'
              }
            >
              <Button variant="outline">{blogPageData?.featurePostButtonText}</Button>
            </LocaleLink>
          </div>
        </div>
        <section className="sm:mt-[175px] mt-[100px]">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h3 className="sm:text-[53px] text-[35px] font-semibold">
              {blogPageData?.moreArticlesTitle}
            </h3>
            {/* <div className="flex gap-5">
              <SearchInput />
              <Popover>
                <PopoverTrigger className="hover:bg-teal-500 hover:border-none border border-black px-4 py-1 rounded">
                  <SlidersVertical />
                </PopoverTrigger>
                <PopoverContent className="mr-10 rounded">
                  <p className="font-bold">Sorted by</p>
                  <div className="my-5 space-y-5">
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">Newest First</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="a" />
                      <Label htmlFor="a">Last First</Label>
                    </div>
                  </div>
                  <p className="font-bold">Categories</p>
                  <div className="my-5 space-y-5">
                    <div className="flex items-center gap-3">
                      <Checkbox id="n" />
                      <Label
                        className="bg-[#f59e0b] rounded-full px-6 py-2 font-bold text-white"
                        htmlFor="n"
                      >
                        المزايدات{' '}
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Button className="w-full text-teal-500">Save</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div> */}
          </div>
          <div className="mt-[130px] mb-[100px]">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-[55px]">
              {docs.map((doc, i) => (
                <div key={i} className={cn('')}>
                  <div className="max-h-[320px]">
                    <Image
                      src={
                        typeof doc.heroImage === 'string'
                          ? (doc.heroImage ?? '/placeholder.png')
                          : typeof doc.heroImage === 'object' &&
                              doc.heroImage !== null &&
                              'url' in doc.heroImage &&
                              typeof doc.heroImage.url === 'string'
                            ? (doc.heroImage.url ?? '/placeholder.png')
                            : '/placeholder.png'
                      }
                      alt="banner "
                      className="max-h-[320px] h-full w-full object-cover"
                      width={600}
                      height={320}
                    />
                  </div>
                  <div className="flex justify-between my-5">
                    <div className="bg-[#5b39bb] font-bold text-[14px] text-white px-[24px] py-[8px] rounded-full">
                      {doc.heroTag}
                    </div>
                  </div>
                  <div>
                    <LocaleLink
                      href={`/blogs/${doc.slug}`}
                      className="font-bold text-[30px] my-[25px] hover:underline hover:text-[#5b39bb] transition-colors"
                    >
                      {doc.title}
                    </LocaleLink>
                    <p className="text-sm">{doc['Short Description']}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </section>
  )
}

export default Page

export async function generateMetadata() {
  return {
    title: `Ostool | Blogs`,
  }
}

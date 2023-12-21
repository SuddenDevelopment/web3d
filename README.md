Features
- drag and drop create new 3d scenes with options / templates
  - focus object
  - environment
  - background fx
  - (tbd) interface
  - (tbd) data
- antd integrated for 2d ui
- deployment considerations built in
- dev vs prod environments
- tutorial links
- analysis and suggestions
- integrated editor
- integrated animator
- material tools

notes:
- sometimes you need to restart the dev server to get the latest changes

==============

- set default camera
- change light intensities
  - <Canvas shadows gl={{ physicallyCorrectLights: true, toneMappingExposure:.02 }}>
  - <ambientLight intensity={3}/>
  - <PerspectiveCamera name="Camera" makeDefault={true} far={100000} near={0.1} fov={22.9} position={[-465.25, -92.76, -467.37]} rotation={[2.94, -0.78, 3]} />
- instances vs not instances
- dont use shadows and instances at same time
  - castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-.0000001} in Model.jsx
  - 


==============

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


next? trying to find MVP
Goals: MVP
- community building
- promoting + enabling easier 3d web development

Audience:
- 3D Artists (25%)
- Web Developers (75%)

- needs a compelling use case like ( make a shit ton of money )
  - portfolio
  - product
  - presentation
  - environment
  - 3d data vis
  - game
  - effects / enhancement to 2d page
  - navigation / interface

- turn primary page into a portfolio page
- add stats to pages/models
- analyze files, fix things
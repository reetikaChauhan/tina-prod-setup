import { Collection, TinaTemplate } from "@tinacms/cli";
import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import { TinaCMS } from 'tinacms';
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from 'tinacms-authjs/dist/tinacms';
import { LocalAuthProvider } from 'tinacms'


const admonitionValues = ['note', 'tip', 'warning', 'important', 'info', 'caution', 'danger', 'question', 'podcast', 'newsletter', 'company', 'contribute', 'book', 'expert']
const admonitionOptions = admonitionValues.map(v => {
  const first = v.slice(0, 1)
  const rest = v.slice(1)
  return {
    value: v,
    label: `${first.toUpperCase()}${rest}`
  }
})

const ImageCardTemplate: TinaTemplate = {
  name: "ImageCard",
  label: "Image card",
  ui: {
    defaultItem: {
      title: "Title",
      description: "What this card is about...",
      imageUrl: "",
      linkUrl: ""
    },
  },
  fields: [{
    name: "title",
    label: "Title",
    isTitle: true,
    required: true,
    type: "string"
  }, {
    name: "description",
    label: "Description",
    type: "string",
    ui: {
      component: "textarea"
    }
  }, {
    name: "imageUrl",
    label: "Image",
    type: "string"
  }, {
    name: "linkUrl",
    label: "Link",
    type: "string"
  }]
}

const AdmonitionTemplate: TinaTemplate = {
  name: "Admonition",
  label: "Admonition",
  ui: {
    defaultItem: {
      title: "Note",
      type: "note"
    },
    itemProps: (item) => {
      return { label: item.title }
    }
  },
  fields: [{
    name: "title",
    label: "Title",
    type: "string",
    isTitle: true,
    required: true
  }, {
    name: "type",
    label: "Type",
    type: "string",
    options: admonitionOptions
  }, {
    name: "children",
    isBody: true,
    type: "rich-text"
  }]
}

const solutionCollection: Collection = {
  name: "solution",
  label: "Solutions",
  path: "solutions",
  format: "mdx",
  fields: [{
      name: "title",
      label: "Title",
      type: "string",
      isTitle: true,
      required: true
  }, {
    name: "description",
    label: "Description",
    type: "string",
    ui: {
      component: "textarea"
    }
  }, {
    name: "image",
    label: "Image",
    type: "image"
  }]
}

const token = process.env.TINA_TOKEN 
const cid = process.env.TINA_CLIENT_ID
// TinaCMS configuration
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
export default defineConfig({
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  branch: 'main',
  clientId: cid, 
  token: token, 
  
  contentApiUrlOverride: '/tina/gql',// Update the path to point to the local Netlify function
  
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "static"
    }
  },
  
  build: {
    publicFolder: "static",
    outputFolder: "admin",
    
  },

  schema: {
    collections: [
    //   {
    //     name: "page",
    //     label: "Page",
    //     path: "contents/pages",
    //     format: "md",
    //     ui: {
    //         router: props => {
    //             return "/"
    //         }
    //     },
    //     fields: [
    //       {
    //         name: "title",
    //         type: "string",
    //       },
    //       {
    //         name: "blocks",
    //         label: "Blocks",
    //         type: "object",
    //         list: true,
    //         templates: [
    //           {
    //             name: "mission",
    //             label: "Mission",
    //             fields: [
    //               {
    //                 name: "text",
    //                 label: "Text",
    //                 type: "rich-text",
    //               }, {
    //                 name: "link",
    //                 label: "Link",
    //                 type: "object",
    //                 fields: [{
    //                     name: "link",
    //                     label: "Link",
    //                     type: "string"
    //                 }, {
    //                     name: "label",
    //                     label: "Label",
    //                     type: "string"
    //                 }]
    //               }
    //             ],
    //           },
    //           {
    //             name: "links",
    //             label: "Links",
    //             fields: [
    //               {
    //                 name: "links",
    //                 label: "Links",
    //                 type: "object",
    //                 list: true,
    //                 fields: [
    //                   {
    //                     name: "link",
    //                     label: "Link",
    //                     type: "string",
    //                   },
    //                   {
    //                     name: "label",
    //                     label: "Label",
    //                     type: "string",
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
      solutionCollection,
      {
        name: "docs",
        label: "Docs",
        path: "docs",
        format: "md",
        fields: [{
            name: "title",
            label: "Title",
            type: "string",
        }, {
          name: "body",
          label: "Body",
          isBody: true,
          type: "rich-text",
          templates: [AdmonitionTemplate, ImageCardTemplate]
        }, {
          name: "solution",
          label: "Solutions in this sector",
          type: "object",
          fields: [{
            name: "solutions",
            label: "Solutions",
            type: "object",
            list: true,
            fields: [{
              name: "solution",
              label: "Solution",
              type: "reference",
              collections: ["solution"],
              ui: {
                parse: (val) => {
                  console.log({val})
                  return val
                },
                format: (val) => {
                  return val
                }
              }
            }]
          }]
        }]
      }
    ],
  },
});
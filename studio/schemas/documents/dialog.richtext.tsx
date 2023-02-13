import { blocksToText } from "../../utils/portableText/portableTextToText";
import { Website } from "@vectopus/atlas-icons-react";
import React from "react";
import { SlugRule, defineType, defineField } from "sanity";

const schema = defineType({
  name: "dialog.richtext",
  title: "Rich Text Dialog",
  type: "object",
  icon: () => <Website weight="thin" />,
  preview: {
    select: {
      content: "content",
    },
    prepare({ content = [] }: any) {
      return {
        title: blocksToText(content),
      };
    },
  },
  fields: [
    defineField({
      name: "slug",
      title: "Identifier",
      type: "slug",
      validation: (Rule: SlugRule) => Rule.required(),
      description:
        "Unique identifier used to link to this dialog from a button. Only lowercase and no special characters except -",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "portabletext.full",
    }),
  ],
});

export default schema;

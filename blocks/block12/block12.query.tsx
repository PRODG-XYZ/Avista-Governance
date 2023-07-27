import { resolveIdHrefQuery } from "../../components/buttons/button.query";
import { imageQuery } from "../../components/images/image.query";
import { richTextQuery } from "../../components/portabletext/portabletext.query";
import { LanguageType } from "../../languages";
import { RESOURCE_SCHEMAS_LIST } from "../../types.sanity";
import groq from "groq";

export const getBlock12Query = (language: LanguageType) => groq`
  _type == "block.block12" => {
    _key,
    _type,
    title,
    intro[] ${richTextQuery},
    "items": *[
      (
        // get pages matching filtered types, e.g [page.blog, page.event]
        (
          _type in ^.filter.types 
          && 
          (
            defined(^.filter.types)
            || count(^.filter.types) > 0
          )
        )
        ||
        // get pages matching all taggable schemas if no types are defined
        (
          _type in ['${RESOURCE_SCHEMAS_LIST.join("','")}']
          && (
            !defined(^.filter.types)
            || count(^.filter.types) == 0
          )
        )
      )
      // filter by tags
      && (
        !defined(^.filter.tags)
        || count(^.filter.tags) == 0
        || count(tags[@._ref in ^.^.filter.tags[]._ref]) > 0 
      )
      && !(_id in path("drafts.*"))
      && language == "${language}"
    ] {
      _id,
      publishedAt,
      _createdAt,
      "type": _type,
      title,
      "href": ${resolveIdHrefQuery},
      "image": select(
        defined(image) => ${imageQuery},
        defined(blocks[0].image) => blocks[0] { 
          "image": ${imageQuery} 
        }.image,
      ),
      "intro": coalesce(
        pt::text(blocks[0].intro),
        pt::text(modules[_type == 'module.richtext'][0].content),
      ),
      "tags": tags[]->title,
      "authors": authors[]-> { 
        name, 
        "image": ${imageQuery} 
      },
      "date": coalesce(publishedAt, _createdAt),
    } | order(publishedAt desc, _createdAt desc) 
}`;

import { TextProps } from "../../components/block/Text";
import { WrapperProps } from "../../components/block/Wrapper";
import { BackgroundColorType } from "../../components/block/background.options";
import { SpaceType } from "../../components/block/spacing.options";
import { ButtonProps } from "../../components/buttons/Button";
import { ButtonGroupProps } from "../../components/buttons/ButtonGroup";
import { ResponsiveImageProps } from "../../components/images/ResponsiveImage";
import { PortableTextProps } from "../../components/portabletext/PortableText";
import { TitleProps } from "../../components/title/Title";
import {
  TitleFontType,
  TitleWeightType,
} from "../../components/title/title.options";
import { bumpHeadingLevel } from "../../helpers/utils/string";
import { textClasses } from "../../theme";
import { HeadingLevelType, ImageType } from "../../types";
import {
  TitleSizeType,
  TitleColorType,
  IntroColorType,
  IntroSizeType,
  AlignType,
} from "./block8.options";
import cx from "classnames";
import React, { ComponentType, lazy } from "react";

const Wrapper = lazy<ComponentType<WrapperProps>>(
  () =>
    import(/* webpackChunkName: "Wrapper" */ "../../components/block/Wrapper"),
);

const Title = lazy<ComponentType<TitleProps>>(
  () => import(/* webpackChunkName: "Title" */ "../../components/title/Title"),
);

const Text = lazy<ComponentType<TextProps>>(
  () => import(/* webpackChunkName: "Text" */ "../../components/block/Text"),
);

const PortableText = lazy<ComponentType<PortableTextProps>>(
  () =>
    import(
      /* webpackChunkName: "PortableText" */ "../../components/portabletext/PortableText"
    ),
);

const ResponsiveImage = lazy<ComponentType<ResponsiveImageProps>>(
  () =>
    import(
      /* webpackChunkName: "ResponsiveImage" */ "../../components/images/ResponsiveImage"
    ),
);

const ButtonGroup = lazy<ComponentType<ButtonGroupProps>>(
  () =>
    import(
      /* webpackChunkName: "ButtonGroup" */ "../../components/buttons/ButtonGroup"
    ),
);

export type Block8Props = {
  theme?: {
    block?: {
      background?: BackgroundColorType;
      space?: SpaceType;
      align?: AlignType;
    };

    title?: {
      color?: TitleColorType;
      size?: TitleSizeType;
      level?: HeadingLevelType;
      font?: TitleFontType;
      weight?: TitleWeightType;
    };

    intro?: {
      color?: IntroColorType;
      size?: IntroSizeType;
    };
  };

  title?: string;
  intro?: React.ReactNode;
  items?: ItemProps[];
};

const alignClasses: Record<AlignType, string> = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
};

const gridClasses: Record<number, string> = {
  0: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  1: "grid grid-cols-1",
  2: "grid grid-cols-1 sm:grid-cols-2",
  3: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

export const Block8 = ({ theme, title, intro, items }: Block8Props) => {
  return (
    <Wrapper
      theme={{
        ...theme?.block,
      }}
    >
      <div
        className={cx(
          alignClasses[theme?.block?.align || "center"],
          theme?.intro?.color && textClasses[theme?.intro?.color],
        )}
      >
        <div
          className={cx(
            "max-w-3xl",
            alignClasses[theme?.block?.align || "center"],
          )}
        >
          {title && (
            <div
              className={cx(
                "mb-6",
                alignClasses[theme?.block?.align || "center"],
              )}
            >
              <Title
                size={theme?.title?.size || "4xl"}
                as={theme?.title?.level}
                color={theme?.title?.color}
                font={theme?.title?.font}
                weight={theme?.title?.weight}
              >
                {title}
              </Title>
            </div>
          )}

          {intro && (
            <div className="mb-6">
              <Text
                size={theme?.intro?.size || "lg"}
                color={theme?.intro?.color}
                align={theme?.block?.align || "center"}
              >
                <PortableText content={intro as any} />
              </Text>
            </div>
          )}
        </div>

        {items && (
          <div
            className={cx(
              "mt-20 gap-x-12 gap-y-10 md:gap-x-24 max-w-4xl",
              alignClasses[theme?.block?.align || "center"],
              gridClasses[items?.length <= 4 ? items?.length : 0],
            )}
          >
            {Boolean(items?.filter(Boolean).length) &&
              items?.map((item: ItemProps) => {
                return (
                  <Item
                    key={item._key}
                    align={theme?.block?.align}
                    {...item}
                    blockTitleLevel={theme?.title?.level}
                  />
                );
              })}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

type ItemProps = {
  _key: string;
  title: string;
  intro?: React.ReactNode;
  image?: ImageType;
  buttons?: ButtonProps[];
  align?: AlignType;
  blockTitleLevel?: HeadingLevelType;
};

const Item = ({
  title,
  intro,
  image,
  buttons,
  align,
  blockTitleLevel,
}: ItemProps) => {
  return (
    <div>
      {image && (
        <div className="inline-block mb-6 aspect-square max-w-[100px]">
          <ResponsiveImage {...image} />
        </div>
      )}

      {title && (
        <Title
          as={bumpHeadingLevel(blockTitleLevel || "h2") as HeadingLevelType}
          size="xl"
          className={cx("text-current mb-2", alignClasses[align || "center"])}
        >
          {title}
        </Title>
      )}

      {intro && (
        <Text align={align || "center"} size="sm" className="mb-6">
          <PortableText content={intro as any} />
        </Text>
      )}

      {buttons && Boolean(buttons?.filter(Boolean).length) && (
        <ButtonGroup items={buttons} className="mt-6" />
      )}
    </div>
  );
};

export default React.memo(Block8);

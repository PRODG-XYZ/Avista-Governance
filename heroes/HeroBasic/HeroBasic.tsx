import { ButtonProps } from "../../components/buttons/Button";
import { ButtonGroup } from "../../components/buttons/ButtonGroup";
import PortableText from "../../components/content/PortableText";
import { SimpleImage } from "../../components/images/SimpleImage";
import { Bleed } from "../../components/module/Bleed";
import { Text } from "../../components/module/Text";
import { Title } from "../../components/module/Title";
import { Width } from "../../components/module/Width";
import { ImageType } from "../../types";
import React from "react";

export type HeroBasicProps = {
  eyebrow?: string;
  title?: string;
  buttons?: ButtonProps[];
  text?: React.ReactElement;
  image?: ImageType;
};

export const HeroBasic = (data: HeroBasicProps) => {
  if (!data) return null;

  const { eyebrow, title, buttons, text, image }: HeroBasicProps = data;

  return (
    <header className="relative z-0 overflow-hidden text-neutral-500">
      <div className="relative flex flex-row items-center z-30 pt-10 md:pt-15 lg:pt-20">
        <Bleed bleed="md">
          <Width width="inner">
            <div className="relative flex flex-col tablet:max-w-[75%] lg:max-w-[790px] gap-4 text-center mx-auto">
              {(title || eyebrow) && (
                <Title as="h1" size="6xl" color="neutral-800" eyebrow={eyebrow}>
                  {title}
                </Title>
              )}

              {text && (
                <Text
                  size="2xl"
                  className="mt-2"
                  color="neutral-900"
                  align="center"
                >
                  <PortableText content={text as any} />
                </Text>
              )}

              {buttons && (
                <ButtonGroup
                  className="mt-4 md:mt-6 lg:mt-8 mx-auto"
                  items={buttons}
                  align="center"
                />
              )}
            </div>
            {image && (
              <div className="relative inline-block mx-auto overflow-hidden rounded-lg mt-10">
                <SimpleImage
                  {...image}
                  priority
                  loading="eager"
                  width={160 * 15}
                  height={90 * 15}
                />
              </div>
            )}
          </Width>
        </Bleed>
      </div>
    </header>
  );
};

export default React.memo(HeroBasic);

import { Injectable } from '@nestjs/common';

/**
 * Offers some static factory methods to make the creation of message blocks easier
 *
 * @author Steffen Bauer (IBM CIC Germany GmbH)
 */
@Injectable()
export class BlockKitBuilderService {
  /**
   * Creates a simple plain-text section without any formatting capability
   *
   * @param text  a plain text
   */
  public static createPlainText(text: string) {
    return {
      type: 'section',
      text: {
        type: 'plain_text',
        text,
        emoji: false,
      },
    };
  }

  /**
   * Creates a Markdown section with a Markdown formatted string
   *
   * @param text the text with Markdown formatted parts
   */
  public static createMarkdown(text: string) {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
    };
  }

  /**
   * Creates an image section consisting of a Markdown formatted text and an image url
   *
   * @param text the text with Markdown formatted parts
   * @param image_url the image url
   * @param alt_text an alternative text related to the image
   */
  public static createImage(text: string, image_url: string, alt_text: string) {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'image',
        image_url,
        alt_text,
      },
    };
  }

  /**
   * Create a header section
   *
   * @param text a plain text used as header
   */
  public static createHeader(text: string) {
    return {
      type: 'header',
      text: {
        type: 'plain_text',
        text,
        emoji: true,
      },
    };
  }

  /**
   * Composes a help text consisting of multiples sections.
   */
  public static createHelp() {
    const blocks = [];

    blocks.push(BlockKitBuilderService.createHeader('How to use'));
    blocks.push(BlockKitBuilderService.createMarkdown('/thx @user1 @user2 ... @userX  - gives a thank you to the mentioned users'));
    blocks.push(BlockKitBuilderService.createMarkdown('/thx all  - shows a overall statistic'));
    blocks.push(BlockKitBuilderService.createMarkdown('/thx top5  - shows the current TOP5'));
    blocks.push(BlockKitBuilderService.createMarkdown('/thx me  - shows the detailed statistic for you'));
    blocks.push(BlockKitBuilderService.createMarkdown('You can combine all options, e.g. /thx @user1 @user2 top5'));

    return blocks;
  }
}

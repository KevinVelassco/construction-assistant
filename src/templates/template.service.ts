import * as path from 'path';
import * as fs from 'fs';
import hbs from 'handlebars';
import mjml2html from 'mjml';

export class TemplateService {
  static generateHtmlByTemplate(templateName: string, parameters: object = {}) {
    // get the path of the template
    const filePath = `./emails/${templateName}.mjml`;
    const templatePath = path.resolve(__dirname, filePath);

    // compile the template
    const template = hbs.compile(fs.readFileSync(templatePath, 'utf8'));

    // get the result
    const result = template(parameters);

    // get the html
    const { html } = mjml2html(result);

    return html;
  }
}

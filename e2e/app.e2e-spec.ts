import { SigldmsPage } from './app.po';

describe('sigldms App', () => {
  let page: SigldmsPage;

  beforeEach(() => {
    page = new SigldmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

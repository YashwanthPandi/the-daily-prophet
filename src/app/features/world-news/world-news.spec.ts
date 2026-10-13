import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WorldNews } from './world-news';
import { NewsStore } from '../../core/services/news-store';

// Tiny fake feeds so tests never hit the real internet.
const FAKE_GOOGLE = `<?xml version="1.0"?><rss><channel>
  <item>
    <title>Hogwarts reopens - Daily Prophet</title>
    <link>https://example.com/1</link><guid>1</guid>
    <pubDate>Mon, 12 Oct 2026 12:00:00 GMT</pubDate>
    <source url="https://example.com">Daily Prophet</source>
  </item>
  <item>
    <title>Quidditch final tonight - Quibbler</title>
    <link>https://example.com/2</link><guid>2</guid>
    <pubDate>Sun, 11 Oct 2026 12:00:00 GMT</pubDate>
    <source url="https://example.org">Quibbler</source>
  </item>
</channel></rss>`;

// Older than both Google stories, but it has a photo, so it should lead.
const FAKE_BING = `<?xml version="1.0"?><rss xmlns:News="https://www.bing.com/news"><channel>
  <item>
    <title>Owl post delayed across Britain</title>
    <link>http://www.bing.com/news/apiclick.aspx?ref=FexRss&amp;url=https%3a%2f%2fowls.example%2fdelay&amp;c=1</link>
    <description>Thousands of letters are stuck in Hogsmeade.</description>
    <pubDate>Sat, 10 Oct 2026 12:00:00 GMT</pubDate>
    <News:Source>Witch Weekly on MSN</News:Source>
    <News:Image>http://www.bing.com/th?id=OWL&amp;pid=News</News:Image>
  </item>
</channel></rss>`;

const EMPTY_FEED = '<?xml version="1.0"?><rss><channel></channel></rss>';

describe('WorldNews', () => {
  let component: WorldNews;
  let fixture: ComponentFixture<WorldNews>;
  let httpMock: HttpTestingController;

  const isGoogle = (req: { url: string }) => req.url === '/google-news/rss/search';
  const isBing = (req: { url: string }) => req.url === '/bing-news/news/search';

  /**
   * Answer the requests the page makes on load: one Google search, plus
   * SEVERAL Bing photo searches. `match()` returns every request that fits
   * (expectOne would fail on more than one). The first Bing search gets the
   * given feed, the rest come back empty.
   */
  function respond(google: string, bing: string) {
    httpMock.expectOne(isGoogle).flush(google);
    httpMock.match(isBing).forEach((req, i) => req.flush(i === 0 ? bing : EMPTY_FEED));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldNews],
      // The component's service needs HttpClient. provideHttpClientTesting
      // swaps the real network for a controller we can answer by hand.
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldNews);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // triggers ngOnInit → the HTTP requests
  });

  afterEach(() => httpMock.verify()); // fail if any request was left unanswered

  it('should create', () => {
    respond(FAKE_GOOGLE, EMPTY_FEED);
    expect(component).toBeTruthy();
  });

  it('parses the feed, strips the source from titles, and filters by search', () => {
    respond(FAKE_GOOGLE, EMPTY_FEED);

    expect(component.articles().length).toBe(2);
    expect(component.leadStory()?.title).toBe('Hogwarts reopens');
    expect(component.leadStory()?.source).toBe('Daily Prophet');

    // Search now lives in the shared store (the header's toolbar calls this).
    TestBed.inject(NewsStore).setSearch('quidditch');
    expect(component.filteredArticles().map((a) => a.title)).toEqual(['Quidditch final tonight']);
  });

  it('puts a photographed Bing story in the lead and keeps the rest in date order', () => {
    respond(FAKE_GOOGLE, FAKE_BING);

    const lead = component.leadStory()!;
    expect(lead.title).toBe('Owl post delayed across Britain');
    expect(lead.link).toBe('https://owls.example/delay'); // tracking link unwrapped
    expect(lead.source).toBe('Witch Weekly'); // " on MSN" removed
    expect(lead.imageUrl).toContain('https://www.bing.com/th?id=OWL');
    expect(lead.summary).toBe('Thousands of letters are stuck in Hogsmeade.');

    expect(component.featuredStories().map((a) => a.title)).toEqual([
      'Hogwarts reopens',
      'Quidditch final tonight',
    ]);
  });

  it('still shows Google headlines when the Bing requests fail', () => {
    httpMock.expectOne(isGoogle).flush(FAKE_GOOGLE);
    httpMock
      .match(isBing)
      .forEach((req) => req.flush('nope', { status: 503, statusText: 'Unavailable' }));

    expect(component.error()).toBeNull();
    expect(component.articles().length).toBe(2);
  });

  it('shows an error message when the Google request fails', () => {
    httpMock.expectOne(isGoogle).flush('boom', { status: 500, statusText: 'Server Error' });
    // forkJoin cancels the other requests once one fails, so Bing is never answered.
    httpMock.match(isBing);

    expect(component.error()).toBeTruthy();
    expect(component.loading()).toBe(false);
  });
});

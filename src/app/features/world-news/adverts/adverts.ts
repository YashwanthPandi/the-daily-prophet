import { Component } from '@angular/core';

// Static in-world advertisements, like the little boxed adverts that fill
// the gaps on the prop papers. No inputs, no logic: a component can be
// pure markup + styles, which keeps the page template short.
@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.html',
  styleUrl: './adverts.scss',
  host: { role: 'complementary', 'aria-label': 'Advertisements' },
})
export class Adverts {}

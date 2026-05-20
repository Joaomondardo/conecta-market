import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3001/api/products', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          name: 'Smartphone Premium',
          price: 2999.90,
          slug: 'smartphone-premium',
        },
        {
          id: '2',
          name: 'Notebook Ultra',
          price: 4500.00,
          slug: 'notebook-ultra',
        },
      ]
    });
  }),
];

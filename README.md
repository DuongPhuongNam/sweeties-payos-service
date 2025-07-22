# Sweeties PayOS Service

PayOS payment service for Sweeties Dodging game.

## Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

## Environment Variables

Set these in Vercel dashboard:
- `PAYOS_CLIENT_ID`
- `PAYOS_API_KEY`
- `PAYOS_CHECKSUM_KEY`
- `FRONTEND_DOMAIN`

## API Endpoints

- `POST /api/create-payment-link`
- `GET /api/get-payment?orderCode={code}`
- `GET /api/get-transaction?orderCode={code}`
- `PUT /api/cancel-payment?orderCode={code}`
- `POST /api/payos-webhook`
- `GET /api/stats/today`
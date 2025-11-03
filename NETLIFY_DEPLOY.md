# Guia de Deploy no Netlify

## Variáveis de Ambiente Necessárias

Configure estas variáveis em: **Site settings > Build & deploy > Environment variables**

### Obrigatórias (WooCommerce):
```
WOOCOMMERCE_STORE_URL=https://embraflexbr.com.br
WOOCOMMERCE_CONSUMER_KEY=ck_58c97d066289e666ad8a5f91741042f90633d340
WOOCOMMERCE_CONSUMER_SECRET=cs_d342dee925de0370f45a892d1bb903f589238a86
```

### Para evitar erros de build (Medusa - mock):
```
MEDUSA_BACKEND_URL=https://mock-medusa-backend.example.com
```

### Opcional (Next.js):
```
NEXT_PUBLIC_BASE_URL=https://seu-site.netlify.app
```

## Passos para Deploy

1. ✅ **Adicione as 4 variáveis de ambiente acima no Netlify**
2. ✅ **Commit e push das alterações para o repositório**
3. ✅ **Netlify fará o deploy automático**

## Configuração do Build

O arquivo `netlify.toml` já está configurado com:
- Comando de build: `yarn build`
- Diretório de publicação: `.next`
- Plugin Next.js: `@netlify/plugin-nextjs`

## Troubleshooting

Se ainda encontrar erros:

1. **Erro de conexão ECONNREFUSED**: Verifique se a variável `MEDUSA_BACKEND_URL` está configurada no Netlify
2. **Erro de variável faltando**: Verifique se todas as 4 variáveis estão adicionadas corretamente
3. **Erro de build**: Limpe o cache do Netlify em Site settings > Build & deploy > Clear cache and deploy site

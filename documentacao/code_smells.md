# Descrição
Utilizei SonarQube e ESLint para encontrar os code smells

## Code Smell 1

**Trecho original:**
```
'use client'

import { theme } from '@/styles/theme'
import { ThemeProvider } from 'styled-components'

export function ThemeClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
```
**Explicação:**

O Code Smell: Props Mutáveis (Mutable Props)

O SonarQube apontou um code smell clássico em componentes React: as propriedades (props) do componente não são "somente leitura" (read-only).
Em React, existe um princípio fundamental chamado fluxo de dados unidirecional, isso significa que os dados devem fluir em apenas uma direção: do componente pai para o componente filho.

A parte { children: React.ReactNode } define a "forma" das props, como não há nenhuma indicação de que children é somente leitura, o TypeScript permite, teoricamente, que seu componente tente modificar essa prop, o que viola o princípio que o SonarQube está protegendo.

**Trecho Refatorado**
```
'use client'

import { theme } from '@/styles/theme'
import { ThemeProvider } from 'styled-components'
import type { JSX, ReactNode } from 'react' 

type ThemeClientProps = {
  readonly children: ReactNode
}

export function ThemeClient({ children }: ThemeClientProps): JSX.Element{
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
```


## Code Smell 2
**Trecho original:**
```
const isValidToken = (token: string | undefined): boolean => {
  if (!token) return false

  try {
    const decoded: { exp: number } = jwtDecode(token)
    return decoded.exp > Date.now() / 1000
  } catch (e) {
    return false
  }
}
```

**Explicação**

O Code Smell: Exceção Ignorada em Bloco

 O código possuía um bloco try...catch que capturava exceções potenciais durante o processamento do middleware, mas não realizava nenhuma ação no bloco catch, isso fazia com que erros fossem ignorados silenciosamente, tornando a aplicação frágil e difícil de depurar, a ausência de tratamento também levava a um erro de "variável não utilizada" (no-unused-vars) pelo ESLint.

**Trecho Refatorado**
```
const isValidToken = (token: string | undefined): boolean => {
  if (!token) {
    return false
  }

  try {
    const decoded: { exp: number } = jwtDecode(token)
    return decoded.exp > Date.now() / 1000
  } catch (error) {
    console.error('Erro ao decodificar o token JWT:', error)
    return false
  }
}
```

## Code Smell 3
**Trecho original:**
```
 {animal.images.map((image, index) => (
              <S.AnimalPictureSwiperSlide key={index}>
                <Image
                  src={`data:image/jpeg;base64,${image}`}
                  alt="Animal"
                  fill={true}
                  objectFit="cover"
                />
              </S.AnimalPictureSwiperSlide>
```


**Explicação**

O Code Smell:  Uso do Índice do Array como key em Listas React

O SonarQube alertou sobre uma má prática fundamental no React, ao renderizar uma lista de elementos (usando .map()), o React precisa de uma propriedade especial chamada key em cada elemento da lista, essa key deve ser um identificador único e estável para cada item.

**Trecho Refatorado**
```
{animal.images.map((image, index) => (
    <S.AnimalPictureSwiperSlide key={image}>
        <Image
            src={`data:image/jpeg;base64,${image}`}
            alt="Animal"
            fill={true}
            objectFit="cover"
        />
    </S.AnimalPictureSwiperSlide>
))}
```

## Code Smell 4
**Trecho original:**
```
 router.patch(
  '/users',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  updateUserControllerInstance.handle.bind(updateUserControllerInstance),
)

router.post(
  '/users/chats/messages',
  userAuthMiddlewareInstance.authenticate.bind(userAuthMiddlewareInstance),
  createUserChatMessageControllerInstance.handle.bind(
    createUserChatMessageControllerInstance,
  ),
)
```

**Explicação**

O código no arquivo routes.ts está cheio de repetição de código, além disso ele é um arquivo de rotas centralizado, ele define rotas para users, animals e chats, à medida que a aplicação crescer com novas funcionalidades, este único arquivo ficará cada vez maior, mais difícil de ler e de dar manutenção.

Isso viola o Princípio da Responsabilidade Única (SRP), pois este módulo tem mais de uma razão para mudar (qualquer alteração em qualquer domínio da aplicação o afetará).

**Refatoração sugerida**
Separar as rotas por domínio, criando arquivos de rotas separados para cada um
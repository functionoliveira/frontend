Criação do arquivo package.json
npm init -y 

dependências do projeto (tambem podem ser encontradas no arquivo package.json)
npm install gulp-cli -g
npm install gulp -D
npm i bourbon
npm i bourbon-neat
npm i browser-sync
npm i gulp-cssnano
npm i gulp-sass
npm i gulp-sourcemaps

Cria arquivo gulpfile
npx -p touch nodetouch gulpfile.js

Após criar os arquivos e instalar as dependências iniciamos as regras no arquivo gulp

    1. cssnano + sass é utilizado para compilar o sass, extraí-lo e minificá-lo para css compacto.

    2. Task components: Builda todo conteúdo do arquivo 
    /src/styles/components/base.scss para /assests/css/components/base.css

    3. Task modules: Builda todo conteúdo do arquivo 
    /src/styles/modules/base.scss para /assests/css/modules/base.css

    4. Task components-minify: Extrai o conteúdo do arquivo /assests/css/components/base.css
    e otimiza o arquivo

    5. Task components-minify: Extrai o conteúdo do arquivo /assests/css/modules/base.css
    e otimiza o arquivo

    6. Task scripts: Varre as pastas scripts procurando por cada arquivo main.js dentro delas. Ao
    encontrar este arquivo copia seu conteúdo para o caminho /assets/js/[nome da pasta]?/main.js

    7. Task watch: Observa as pastas citadas anteriormente em busca de alterações, ao encontrar 
    roda os respectivas tasks. Após executar as tasks respectivas sincroniza e recarrega o browser.
    Além de observar as pastas anteriores observa modificações no arquivo index.html

    8. Browser-sync: Inicia um micro servidor sincronizado com o gulp, toda vez que o watch identifica
    uma mudança recarrega a página.

    9. Bourbon e sourcemaps: Identifica o arquivo e a linha de cada estilo aplicado.Estão adicionados 
    as tasks de sass (components e modules).
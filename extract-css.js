/**
 * Script para extrair CSS do index.html original
 * Execute: node extract-css.js
 */

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'index.html');
const outputFile = path.join(__dirname, 'src', 'css', 'styles.css');

try {
    // Ler o arquivo HTML
    const htmlContent = fs.readFileSync(inputFile, 'utf8');
    
    // Extrair conteúdo da tag <style>
    const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
    
    if (styleMatch && styleMatch[1]) {
        const cssContent = styleMatch[1];
        
        // Criar diretório se não existir
        const cssDir = path.dirname(outputFile);
        if (!fs.existsSync(cssDir)) {
            fs.mkdirSync(cssDir, { recursive: true });
        }
        
        // Escrever arquivo CSS
        fs.writeFileSync(outputFile, cssContent, 'utf8');
        
        console.log('✅ CSS extraído com sucesso!');
        console.log(`📁 Arquivo salvo em: ${outputFile}`);
    } else {
        console.error('❌ Não foi possível encontrar a tag <style> no arquivo HTML');
    }
} catch (error) {
    console.error('❌ Erro ao extrair CSS:', error.message);
}


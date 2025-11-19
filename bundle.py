import os

def bundle_project():
    base_dir = os.getcwd()
    js_dir = os.path.join(base_dir, 'js')
    css_dir = os.path.join(base_dir, 'css')

    # Order of JS files is important for dependencies
    js_files = [
        'settings.js',
        'db.js',
        'pdf-parser.js',
        'chunker.js',
        'api-client.js',
        'queue.js',
        'pdf-generator.js',
        'tts.js',
        'main.js'
    ]

    # Read CSS
    css_content = ''
    with open(os.path.join(css_dir, 'style.css'), 'r', encoding='utf-8') as f:
        css_content = f.read()

    # Read JS and strip modules
    js_content = ''
    for js_file in js_files:
        path = os.path.join(js_dir, js_file)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Remove imports
            lines = content.split('\n')
            filtered_lines = []
            for line in lines:
                if line.strip().startswith('import '):
                    continue
                # Remove export keywords
                line = line.replace('export class', 'class')
                line = line.replace('export const', 'const')
                line = line.replace('export function', 'function')
                filtered_lines.append(line)

            js_content += f'\n/* --- {js_file} --- */\n'
            js_content += '\n'.join(filtered_lines)
            js_content += '\n'

    # Read HTML template
    with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # Inject CSS
    html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{css_content}\n</style>')

    # Inject JS
    # Remove the module script tag
    html = html.replace('<script type="module" src="js/main.js"></script>', f'<script>\n{js_content}\n</script>')

    # Write bundled file
    with open(os.path.join(base_dir, 'index_bundled.html'), 'w', encoding='utf-8') as f:
        f.write(html)

    print("Bundled index_bundled.html created successfully.")

if __name__ == '__main__':
    bundle_project()

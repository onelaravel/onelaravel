<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Shared\Services\BladeToSpaCompiler;

class CompileSingleBladeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blade:compile-single {file} {--output=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compile a single Blade template to JavaScript';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $inputFile = $this->argument('file');
        $outputFile = $this->option('output') ?: str_replace('.blade.php', '.js', $inputFile);

        // Kiểm tra file input có tồn tại không
        if (!File::exists($inputFile)) {
            $this->error("❌ File không tồn tại: {$inputFile}");
            return 1;
        }

        $this->info("🔍 Đang compile file: {$inputFile}");
        $this->info("📁 Output file: {$outputFile}");

        try {
            // Đọc nội dung file blade
            $bladeContent = File::get($inputFile);
            
            // Xử lý @vars directive
            $varsDirective = $this->handleVarsDirective($bladeContent);
            $bladeContent = $this->removeVarsDirective($bladeContent);
            
            // Compile blade to JavaScript
            $compiler = new BladeToSpaCompiler();
            $jsTemplate = $compiler->compile($bladeContent);
            
            // Tạo tên function từ tên file
            $functionName = $this->getFunctionName($inputFile);
            
            // Tạo destructuring từ @vars directive
            $destructuring = $this->createDestructuring($varsDirective);
            
            // Tạo JavaScript function
            $jsFunction = $this->generateJsFunction($functionName, $destructuring, $jsTemplate);
            
            // Lưu file
            File::put($outputFile, $jsFunction);
            
            $this->info("✅ Đã compile thành công!");
            $this->info("📁 File output: {$outputFile}");
            
            // Kiểm tra cú pháp JavaScript
            $this->checkJsSyntax($outputFile);
            
        } catch (\Exception $e) {
            $this->error("❌ Lỗi khi compile: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    /**
     * Xử lý @vars directive
     */
    private function handleVarsDirective(string $content): array
    {
        if (preg_match('/@vars\s*\(([^)]+)\)/', $content, $matches)) {
            return $this->parseVarsString($matches[1]);
        }
        return [];
    }

    /**
     * Xóa @vars directive khỏi content
     */
    private function removeVarsDirective(string $content): string
    {
        return preg_replace('/@vars\s*\([^)]+\)/', '', $content);
    }

    /**
     * Parse chuỗi vars
     */
    private function parseVarsString(string $varsString): array
    {
        $vars = [];
        $parts = explode(',', $varsString);
        
        foreach ($parts as $part) {
            $part = trim($part);
            if (preg_match('/\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)/', $part, $matches)) {
                $varName = $matches[1];
                $defaultValue = trim($matches[2]);
                $vars[$varName] = $defaultValue;
            }
        }
        
        return $vars;
    }

    /**
     * Tạo destructuring từ vars
     */
    private function createDestructuring(array $vars): string
    {
        if (empty($vars)) {
            return '';
        }
        
        $destructuring = [];
        foreach ($vars as $varName => $defaultValue) {
            $destructuring[] = "{$varName} = {$defaultValue}";
        }
        
        return "let {" . implode(', ', $destructuring) . "} = __data;";
    }

    /**
     * Lấy tên function từ tên file
     */
    private function getFunctionName(string $filePath): string
    {
        $fileName = basename($filePath, '.blade.php');
        return $fileName;
    }

    /**
     * Tạo JavaScript function
     */
    private function generateJsFunction(string $functionName, string $destructuring, string $jsTemplate): string
    {
        $destructuringLine = $destructuring ? "    {$destructuring}" : '';
        
        return "function {$functionName}(__data = {}) {
{$destructuringLine}
    return `{$jsTemplate}`;
}";
    }

    /**
     * Kiểm tra cú pháp JavaScript
     */
    private function checkJsSyntax(string $filePath): void
    {
        $this->info("🔍 Kiểm tra cú pháp JavaScript...");
        
        $result = shell_exec("node -c {$filePath} 2>&1");
        
        if ($result === null) {
            $this->info("✅ Cú pháp JavaScript hợp lệ!");
        } else {
            $this->error("❌ Lỗi cú pháp JavaScript:");
            $this->error($result);
        }
    }
}



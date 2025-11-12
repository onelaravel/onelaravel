"""
Configuration file for Python Blade Compiler
"""
import os
import json

class CompilerConfig:
    """Configuration class for Blade compiler paths and settings"""
    
    def __init__(self, config_file=None):
        # Base paths - project root is now 2 levels up from compiler directory
        self.project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        
        # Load configuration from JSON file if provided
        if config_file is None:
            config_file = os.path.join(os.path.dirname(__file__), 'compiler.config.json')
        
        self.config_data = self._load_config(config_file)
        
        # Input paths
        self.views_input_path = os.path.join(self.project_root, self.config_data['paths']['views_input'])
        self.js_input_path = os.path.join(self.project_root, self.config_data['paths']['js_input'])
        
        # Build paths (temporary build location)
        self.build_output_path = os.path.join(self.project_root, self.config_data['paths']['build_output'])
        self.build_scopes_path = os.path.join(self.project_root, self.config_data['paths']['build_scopes'])
        
        # Output paths (final deployment location)
        self.public_static_path = os.path.join(self.project_root, self.config_data['paths']['public_static'])
        self.app_output_path = os.path.join(self.project_root, self.config_data['paths']['app_output'])
        self.scopes_output_path = os.path.join(self.project_root, self.config_data['paths']['scopes_output'])
        
        # File patterns
        self.blade_pattern = self.config_data['patterns']['blade']
        self.js_pattern = self.config_data['patterns']['js']
        
        # Output file names
        self.view_templates_file = self.config_data['files']['view_templates']
        self.wrapper_file = self.config_data['files']['wrapper']
        self.main_file = self.config_data['files']['main']
        
        # Settings
        self.default_scope = self.config_data['settings']['default_scope']
        self.auto_create_dirs = self.config_data['settings']['auto_create_dirs']
        self.verbose = self.config_data['settings']['verbose']
        
        # Build directories
        self.build_directories = self.config_data.get('build_directories', [])
    
    def _load_config(self, config_file):
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Config file not found: {config_file}")
            print("Using default configuration...")
            return self._get_default_config()
        except json.JSONDecodeError as e:
            print(f"Error parsing config file: {e}")
            print("Using default configuration...")
            return self._get_default_config()
    
    def _get_default_config(self):
        """Get default configuration"""
        return {
            "paths": {
                "views_input": "resources/views",
                "js_input": "resources/js/app",
                "public_static": "public/static",
                "app_output": "public/static/app",
                "scopes_output": "public/static/app/scopes"
            },
            "files": {
                "view_templates": "view.templates.js",
                "wrapper": "wraper.js",
                "main": "main.js"
            },
            "patterns": {
                "blade": "**/*.blade.php",
                "js": "**/*.js"
            },
            "settings": {
                "default_scope": "web",
                "auto_create_dirs": True,
                "verbose": False
            }
        }
        
    def get_views_path(self, scope=None):
        """Get views input path for specific scope"""
        if scope:
            return os.path.join(self.views_input_path, scope)
        return self.views_input_path
    
    def get_js_input_path(self):
        """Get JavaScript input path"""
        return self.js_input_path
    
    def get_scope_output_path(self, scope):
        """Get output path for specific scope"""
        return os.path.join(self.scopes_output_path, f'{scope}.js')
    
    def get_view_templates_output_path(self):
        """Get view templates output path"""
        return os.path.join(self.app_output_path, self.view_templates_file)
    
    def get_wrapper_output_path(self):
        """Get wrapper output path"""
        return os.path.join(self.app_output_path, self.wrapper_file)
    
    def get_main_output_path(self):
        """Get main output path"""
        return os.path.join(self.app_output_path, self.main_file)
    
    def get_build_output_path(self):
        """Get build output path"""
        return self.build_output_path
    
    def get_build_scopes_path(self):
        """Get build scopes path"""
        return self.build_scopes_path
    
    def get_build_scope_output_path(self, scope):
        """Get build output path for specific scope"""
        return os.path.join(self.build_scopes_path, f'{scope}.js')
    
    def get_build_view_templates_output_path(self):
        """Get build view templates output path"""
        return os.path.join(self.build_output_path, self.view_templates_file)
    
    def get_build_main_output_path(self):
        """Get build main output path"""
        return os.path.join(self.build_output_path, self.main_file)
    
    def get_build_directories(self):
        """Get list of directories to build (relative to resources/views)"""
        return [os.path.join(self.views_input_path, dir_path) for dir_path in self.build_directories]
    
    def update_paths(self, **kwargs):
        """Update configuration paths"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
            else:
                print(f"Warning: Unknown configuration key '{key}'")
    
    def reload_config(self, config_file=None):
        """Reload configuration from file"""
        if config_file is None:
            config_file = os.path.join(os.path.dirname(__file__), 'compiler.config.json')
        
        self.config_data = self._load_config(config_file)
        
        # Update paths
        self.views_input_path = os.path.join(self.project_root, self.config_data['paths']['views_input'])
        self.js_input_path = os.path.join(self.project_root, self.config_data['paths']['js_input'])
        self.public_static_path = os.path.join(self.project_root, self.config_data['paths']['public_static'])
        self.app_output_path = os.path.join(self.project_root, self.config_data['paths']['app_output'])
        self.scopes_output_path = os.path.join(self.project_root, self.config_data['paths']['scopes_output'])
        
        # Update settings
        self.default_scope = self.config_data['settings']['default_scope']
        self.auto_create_dirs = self.config_data['settings']['auto_create_dirs']
        self.verbose = self.config_data['settings']['verbose']
    
    def print_config(self):
        """Print current configuration"""
        print("=== Compiler Configuration ===")
        print(f"Project Root: {self.project_root}")
        print(f"Views Input: {self.views_input_path}")
        print(f"JS Input: {self.js_input_path}")
        print(f"Build Output: {self.build_output_path}")
        print(f"Build Scopes: {self.build_scopes_path}")
        print(f"Public Static: {self.public_static_path}")
        print(f"App Output: {self.app_output_path}")
        print(f"Scopes Output: {self.scopes_output_path}")
        print(f"Default Scope: {self.default_scope}")
        print(f"Auto Create Dirs: {self.auto_create_dirs}")
        print(f"Verbose: {self.verbose}")
        print(f"Build Directories: {len(self.build_directories)} directories")
        for i, dir_path in enumerate(self.build_directories, 1):
            print(f"  {i}. {dir_path}")
        print("=============================")

# Constants for backward compatibility
JS_FUNCTION_PREFIX = "App.View"
HTML_ATTR_PREFIX = "data-"
SPA_YIELD_ATTR_PREFIX = "data-yield-attr"
SPA_YIELD_SUBSCRIBE_KEY_PREFIX = "data-yield-key"
SPA_YIELD_SUBSCRIBE_TARGET_PREFIX = "data-yield-target"
SPA_YIELD_SUBSCRIBE_ATTR_PREFIX = "data-yield-attr"
SPA_YIELD_CONTENT_PREFIX = "data-yield-content"
SPA_YIELD_CHILDREN_PREFIX = "data-yield-children"
SPA_STATECHANGE_PREFIX = "data-statechange-"
APP_VIEW_NAMESPACE = "App.View"
APP_HELPER_NAMESPACE = "App.Helper"

# View functions configuration
class ViewConfig:
    """Configuration for View vs Helper functions"""
    
    # View functions - all other functions go to Helper
    VIEW_FUNCTIONS = [
        # Core functions
        'generateViewId',
        'execute',
        'evaluate',
        'escString',
        'text',
        'templateToDom',
        
        # View management
        'view',
        'loadView',
        'renderView',
        'include',
        'includeIf',
        'extendView',
        
        # View lifecycle
        'setSuperViewPath',
        'addViewEngine',
        'callViewEngineMounted',
        
        # Wrapper functions
        'startWrapper',
        'endWrapper',
        'registerSubscribe',
        
        # Sections
        'section',
        'yield',
        'yieldContent',
        'renderSections',
        'hasSection',
        'getChangedSections',
        'resetChangedSections',
        'isChangedSection',
        'emitChangedSections',
        
        # Stacks
        'push',
        'stack',
        
        # Once
        'once',
        
        # Route
        'route',
        
        # Events
        'on',
        'off',
        'emit',
        
        # Initialization
        'init',
        'setApp',
        'setContainer',
        'clearOldRendering',
        
        # Auth & Error functions (for Blade compatibility)
        'isAuth',
        'can',
        'cannot',
        'hasError',
        'firstError',
        'csrfToken',
        
        # Loop functions (for Blade compatibility)
        'foreach',
        'foreachTemplate'
    ]

    @classmethod
    def is_view_function(cls, function_name):
        """Check if function belongs to View"""
        return function_name in cls.VIEW_FUNCTIONS

    @classmethod
    def is_helper_function(cls, function_name):
        """Check if function belongs to Helper (everything else)"""
        return not cls.is_view_function(function_name)

    @classmethod
    def get_function_source(cls, function_name):
        """Get the source of a function (View or Helper)"""
        return 'View' if cls.is_view_function(function_name) else 'Helper'

    @classmethod
    def generate_function_call(cls, function_name, *args):
        """Generate proper function call based on source"""
        source = cls.get_function_source(function_name)
        
        if args:
            args_str = ', '.join([str(arg) for arg in args])
            return f"App.{source}.{function_name}({args_str})"
        else:
            return f"App.{source}.{function_name}()"

# Global config instance
config = CompilerConfig()

# Example usage:
# from compiler.config import config, ViewConfig
# config.update_paths(views_input_path="/custom/path/views")
# config.print_config()
# ViewConfig.is_view_function('generateViewId')  # True
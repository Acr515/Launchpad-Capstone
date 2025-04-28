import js from '@eslint/js'
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@stylistic': stylistic,
		},
		rules: {
			...reactHooks.configs.recommended.rules,

			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'no-console': 'warn',
			"sort-imports": ["warn", {
				"ignoreCase": false,
				"ignoreDeclarationSort": false,
				"ignoreMemberSort": false,
				"memberSyntaxSortOrder": ['all', 'multiple', 'single', 'none'],
				"allowSeparatedGroups": false
			}],
			

			'@typescript-eslint/no-unused-vars': 'off',

			'@stylistic/no-tabs': 'off',
			'@stylistic/array-bracket-spacing': ['warn', 'never'],
			'@stylistic/arrow-parens': ['warn', 'always', { requireForBlockBody: true }],
			'@stylistic/arrow-spacing': ['warn', { after: true, before: true }],
			'@stylistic/block-spacing': ['warn', 'always'],
			'@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
			'@stylistic/comma-dangle': ['warn', 'always-multiline'],
			'@stylistic/comma-spacing': 'warn',
			'@stylistic/comma-style': ['error', 'last'],
			'@stylistic/computed-property-spacing': ['warn', 'never', { enforceForClassMembers: true }],
			'@stylistic/dot-location': ['error', 'property'],
			'@stylistic/eol-last': ['warn', 'never'],
			'@stylistic/indent': ['warn', 'tab', {
				ArrayExpression: 1,
				CallExpression: { arguments: 1 },
				flatTernaryExpressions: false,
				FunctionDeclaration: { body: 1, parameters: 1 },
				FunctionExpression: { body: 1, parameters: 1 },
				ignoreComments: false,
				ignoredNodes: [
					'TSUnionType',
					'TSIntersectionType',
					'TSTypeParameterInstantiation',
					'FunctionExpression > .params[decorators.length > 0]',
					'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
				],
				ImportDeclaration: 1,
				MemberExpression: 1,
				ObjectExpression: 1,
				offsetTernaryExpressions: true,
				outerIIFEBody: 1,
				SwitchCase: 1,
				tabLength: 4,
				VariableDeclarator: 1,
			}],
			'@stylistic/key-spacing': ['warn', { afterColon: true, beforeColon: false }],
			'@stylistic/keyword-spacing': ['warn', { after: true, before: true }],
			'@stylistic/lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
			'@stylistic/max-statements-per-line': ['warn', { max: 2 }],
			'@stylistic/member-delimiter-style': ['warn', {
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				multilineDetection: 'brackets',
				overrides: {
					interface: {
						multiline: {
							delimiter: 'semi',
							requireLast: true,
						},
					},
				},
				singleline: {
					delimiter: 'semi',
				},
			}],
			'@stylistic/new-parens': 'error',
			'@stylistic/no-extra-parens': ['warn', 'functions'],
			'@stylistic/no-floating-decimal': 'warn',
			'@stylistic/no-mixed-operators': ['warn', {
				allowSamePrecedence: true,
				groups: [
					['==', '!=', '===', '!==', '>', '>=', '<', '<='],
					['&&', '||'],
					['in', 'instanceof'],
				],
			}],
			'@stylistic/no-mixed-spaces-and-tabs': 'warn',
			'@stylistic/no-multi-spaces': 'warn',
			'@stylistic/no-multiple-empty-lines': ['warn', { max: 2, maxBOF: 0, maxEOF: 0 }],
			'@stylistic/no-trailing-spaces': 'warn',
			'@stylistic/no-whitespace-before-property': 'error',
			'@stylistic/object-curly-spacing': ['warn', 'always'],
			// '@stylistic/operator-linebreak': ['error', 'before'],
			'@stylistic/padded-blocks': ['warn', { blocks: 'never', classes: 'never', switches: 'never' }],
			'@stylistic/quote-props': ['warn', 'consistent-as-needed'],
			'@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: false }],
			'@stylistic/rest-spread-spacing': ['warn', 'never'],
			'@stylistic/semi': ['warn', 'always'],
			'@stylistic/semi-spacing': ['error', { after: true, before: false }],
			'@stylistic/space-before-blocks': ['error', 'always'],
			'@stylistic/space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
			'@stylistic/space-in-parens': ['warn', 'never'],
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/space-unary-ops': ['error', { nonwords: false, words: true }],
			'@stylistic/spaced-comment': ['warn', 'always', {
				block: {
					balanced: true,
					exceptions: ['*'],
					markers: ['!'],
				},
				line: {
					exceptions: ['/', '#'],
					markers: ['/'],
				},
			}],
			'@stylistic/template-curly-spacing': 'error',
			'@stylistic/template-tag-spacing': ['error', 'never'],
			'@stylistic/type-annotation-spacing': ['error', {}],
			'@stylistic/type-generic-spacing': 'error',
			'@stylistic/type-named-tuple-spacing': 'error',
			'@stylistic/wrap-iife': ['warn', 'any', { functionPrototypeMethods: true }],
			'@stylistic/yield-star-spacing': ['error', 'both'],
		},
		settings: {}
	},
)

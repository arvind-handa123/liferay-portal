import RuleList from '../RuleList.es';
import {dom as MetalTestUtil} from 'metal-dom';

let component;

const spritemap = 'icons.svg';

const configDefault = {
	formContext: [
		{
			rows: [
				{
					columns: [
						{
							fields: [
								{
									fieldName: 'text1',
									label: 'label text 1'
								}
							]
						}
					]
				}
			]
		}
	],
	rules: [
		{
			actions: [
				{
					action: 'require',
					target: 'text1',
					expression: '[x+2]'
				}
			],
			conditions: [
				{
					operands: [
						{
							type: 'field',
							value: 'value 1'
						},
						{
							type: 'field',
							value: 'value 2'
						}
					],
					operator: 'equals-to'
				}
			],
			['logical-operator']: 'OR'
		}
	],
	spritemap
};

const formContext = [
	{
		rows: [
			{
				columns: [
					{
						fields: [
							{
								fieldName: 'text1',
								label: 'label text 1'
							}
						]
					}
				]
			}
		]
	}
];

const rules = [
	{
		actions: [
			{
				action: 'require',
				target: 'text1'
			},
			{
				action: 'auto-fill',
				target: 'text2'
			},
			{
				action: 'enable',
				target: 'text1'
			},
			{
				action: 'show',
				target: 'text2'
			},
			{
				action: 'calculate',
				target: 'text2'
			},
			{
				action: 'jump-to-page',
				target: 'text2'
			}
		],
		conditions: [
			{
				operands: [
					{
						type: 'field',
						value: 'value 1'
					},
					{
						type: 'string',
						value: 'value 2'
					}
				],
				operator: 'equals-to'
			},
			{
				operands: [
					{
						type: 'field',
						value: 'value 3'
					},
					{
						type: 'field',
						value: 'value 4'
					}
				],
				operator: 'not-equals-to'
			}
		],
		['logical-operator']: 'OR'
	}
];

const strings = {
	value:
		{
			emptyListText: 'there-are-no-rules-yet-click-on-plus-icon-below-to-add-the-first'
		}
};

describe(
	'RuleList',
	() => {
		beforeEach(
			() => {
				jest.useFakeTimers();
			}
		);
		afterEach(
			() => {
				if (component) {
					component.dispose();
				}
			}
		);

		it('should remove one rule item when delete button gets clicked',
			() => {
				component = new RuleList(
					{
						formContext,
						rules,
						spritemap,
						strings
					}
				);

				const deleteButton = document.querySelector('.rule-card-delete');

				const initialSize = component.rules.length;

				MetalTestUtil.triggerEvent(deleteButton, 'click', {});

				jest.runAllTimers();

				const finalSize = component.rules.length;

				expect(finalSize).toEqual(initialSize - 1);
			}
		);

		it('should return the field label for each action',
			() => {
				component = new RuleList(configDefault);

				const contextLabel = component.formContext[0].rows[0].columns[0].fields[0].label;

				const actionLabel = component.rules[0].actions[0].label;

				jest.runAllTimers();

				expect(actionLabel).toEqual(contextLabel);
			}
		);

		it('should show add button when listing the rules',
			() => {
				MetalTestUtil.enterDocument('<button id="addFieldButton" class="hide"></button>');
				const addButton = document.querySelector('#addFieldButton');

				component = new RuleList(
					{
						formContext,
						rules,
						spritemap,
						strings
					}
				);

				component.rules['logical-operator'] = 'OR';

				expect(addButton.classList.contains('hide')).toEqual(false);

				MetalTestUtil.exitDocument(addButton);
			}
		);

		it('should show message when rule list is empty',
			() => {
				component = new RuleList(
					{
						formContext,
						rules: [],
						spritemap,
						strings: {
							emptyListText: 'there-are-no-rules-yet-click-on-plus-icon-below-to-add-the-first'
						}
					}
				);

				expect(component).toMatchSnapshot();

			}
		);


	}
);
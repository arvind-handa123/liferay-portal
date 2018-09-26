import RuleEditor from 'source/components/RuleEditor/RuleEditor.es';
import './__fixtures__/RuleEditorMockField.es';

let component;

const spritemap = 'icons.svg';

const pages = [
	{
		rows: [
			{
				columns: [
					{
						fields: [
							{
								fieldName: 'Nome',
								label: 'Nome',
								options: [
									{
										label: 'Option',
										value: 'Option'
									}
								],
								type: 'text'
							},
							{
								fieldName: 'Sobrenome',
								label: 'text',
								options: [
									{
										label: 'Option',
										value: 'Option'
									}
								],
								type: 'text'
							},
							{
								fieldName: 'CampoDeData',
								label: 'CampoDeData',
								options: [
									{
										label: 'Option',
										value: 'Option'
									}
								],
								type: 'date'
							},
							{
								fieldName: 'EstadoCivil',
								label: 'EstadoCivil',
								options: [
									{
										label: 'Casado',
										value: 'Casado'
									},
									{
										label: 'Solteiro',
										value: 'Solteiro'
									}
								],
								type: 'select'
							}
						]
					}
				]
			}
		]
	}
];

const url = '/o/dynamic-data-mapping-form-builder-roles/';

const firstOperandList = [
	{
		dataType: 'string',
		name: 'Nome',
		options: [
			{
				label: 'Option',
				value: 'Option'
			}
		],
		type: 'text',
		value: 'Nome'
	},
	{
		dataType: 'string',
		name: 'text',
		options: [
			{
				label: 'Option',
				value: 'Option'
			}
		],
		type: 'text',
		value: 'Sobrenome'
	},
	{
		dataType: 'string',
		name: 'EstadoCivil',
		options: [
			{
				label: 'Casado',
				value: 'Casado'
			},
			{
				label: 'Solteiro',
				value: 'Solteiro'
			}
		],
		type: 'select',
		value: 'Estado civil'
	}
];

const secondOperandTypeSelectedList = [
	{
		name: '',
		value: ''
	}
];

const operatorsList = [
	{name: 'contains', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Contains'},
	{name: 'equals-to', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Is equal to'},
	{name: 'is-empty', parameterTypes: ['text'], returnType: 'boolean', value: 'Is empty'},
	{name: 'not-contains', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Does not contain'},
	{name: 'not-equals-to', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Is not equal to'},
	{name: 'not-is-empty', parameterTypes: ['text'], returnType: 'boolean', value: 'Is not empty'}
];

const functionsMetadata = {text: [
	{name: 'contains', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Contains'},
	{name: 'equals-to', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Is equal to'},
	{name: 'is-empty', parameterTypes: ['text'], returnType: 'boolean', value: 'Is empty'},
	{name: 'not-contains', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Does not contain'},
	{name: 'not-equals-to', parameterTypes: ['text', 'text'], returnType: 'boolean', value: 'Is not equal to'},
	{name: 'not-is-empty', parameterTypes: ['text'], returnType: 'boolean', value: 'Is not empty'}
]};

describe(
	'Regression',
	() => {
		beforeEach(() => {
			jest.useFakeTimers();
		});
		it(
			'LPS-85642 Should hide second operand and value when operator is reset',
			() => {

				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('', 'Nome');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('other-field', 'field');

				jest.runAllTimers();

				component.refs.typeValueSelect0.emitFieldEdited('', 'Nome');
				component.refs.conditionOperator0.emitFieldEdited('', '');

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'LPS-85644 Should clear first operand when field is removed from pages',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('Nome', 'Nome');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('other-field', 'field');

				component.pages = [];

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should show third selector when first and second selectors have options selected',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('Nome', 'Nome');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should reset and show fourth input selector when first, second and third have options selected and first selector is text field',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('Nome', 'Nome');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('Value', null);

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should show fourth "select" selector when first, second and third have options selected and first selector is select field',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('EstadoCivil', 'EstadoCivil');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('Value', null);

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should show fourth "date" field when first, second and third have options selected and first selector is date',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('CampoDeData', 'CampoDeData');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('Value', null);

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should add a new condition row when addNewCondition button is clicked',
			() => {
				component = new RuleEditor(
					{
						functionsMetadata,
						pages,
						spritemap,
						url
					}
				);

				component.refs.conditionIf0.emitFieldEdited('CampoDeData', 'CampoDeData');
				component.refs.conditionOperator0.emitFieldEdited('Is not equal to', 'not-equals-to');
				component.refs.type0.emitFieldEdited('Value', null);
				component.refs.addNewCondition.emit('click');

				jest.runAllTimers();

				expect(component).toMatchSnapshot();
			}
		);
	}
);
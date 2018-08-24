import Builder from '../Builder.es';
import {dom as MetalTestUtil} from 'metal-dom';

let component;
const spritemap = 'icons.svg';
let addButton;

describe(
	'Builder',
	() => {
		beforeEach(
			() => {
				jest.useFakeTimers();

				MetalTestUtil.enterDocument('<button id="addFieldButton"></button>');

				addButton = document.querySelector('#addFieldButton');

				component = new Builder(
					{
						spritemap
					}
				);
			}
		);

		afterEach(
			() => {
				MetalTestUtil.exitDocument(addButton);
				if (component) {
					component.dispose();
				}
			}
		);

		it(
			'should render the default markup',
			() => {
				expect(component).toMatchSnapshot();
			}
		);

		it(
			'should continue to propagate the fieldAdded event',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {sidebar} = component.refs;
				const mockEvent = jest.fn();

				sidebar.emit('fieldAdded', mockEvent);

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('fieldAdded', expect.anything());
			}
		);

		it(
			'should continue to propagate the fieldEdited event',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {sidebar} = component.refs;
				const mockEvent = jest.fn();

				sidebar.emit('fieldEdited', mockEvent);

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('fieldEdited', expect.anything());
			}
		);

		it(
			'should continue to propagate the fieldMoved event',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {layoutRenderer} = component.refs;
				const mockEvent = jest.fn();

				layoutRenderer.emit('fieldMoved', mockEvent);

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('fieldMoved', expect.anything());
			}
		);

		it(
			'should continue to propagate the deleteField event',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {layoutRenderer} = component.refs;
				const mockEvent = jest.fn();

				layoutRenderer.emit('deleteButtonClicked', mockEvent);

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('deleteField', expect.anything());
			}
		);

		it(
			'should continue to propagate the fieldClicked event and open the sidebar',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {layoutRenderer, sidebar} = component.refs;
				const mockEvent = jest.fn();

				layoutRenderer.emit('fieldClicked', mockEvent);

				jest.runAllTimers();

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('fieldClicked', expect.anything());
				expect(sidebar.state.show).toBeTruthy();
			}
		);

		it(
			'should continue to propagate the duplicateField event',
			() => {
				const spy = jest.spyOn(component, 'emit');
				const {layoutRenderer} = component.refs;
				const mockEvent = jest.fn();

				layoutRenderer.emit('duplicateButtonClicked', mockEvent);

				jest.runAllTimers();

				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('duplicateField', expect.anything());
			}
		);

		it(
			'should open sidebar when addField button is gets clicked',
			() => {
				console.log('addButton', addButton.id);

				MetalTestUtil.triggerEvent(addButton, 'click', {});

				const sidebar = document.querySelector('.sidebar-container.show');

				expect(sidebar).not.toBe(null);
			}
		);
	}
);
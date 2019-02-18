/* global describe, expect, mount, test */
import React from 'react';
import { enzymeFind } from 'styled-components/test-utils';

import Section from '../Section';

describe('<Section />', () => {
  test('should render an <section> tag', () => {
    const wrapper = mount(<Section />);
    const renderedComponent = enzymeFind(wrapper, Section);
    expect(renderedComponent.type()).toEqual('section');
  });

  test('should have a className attribute', () => {
    const wrapper = mount(<Section />);
    const renderedComponent = enzymeFind(wrapper, Section);
    expect(renderedComponent.prop('className')).toBeDefined();
  });

  test('should adopt a valid attribute', () => {
    const id = 'test';
    const wrapper = mount(<Section id={id} />);
    const renderedComponent = enzymeFind(wrapper, Section);
    expect(renderedComponent.prop('id')).toEqual(id);
  });

  test('should not adopt an invalid attribute', () => {
    const wrapper = mount(<Section attribute="test" />);
    const renderedComponent = enzymeFind(wrapper, Section);
    expect(renderedComponent.prop('attribute')).toBeUndefined();
  });
});

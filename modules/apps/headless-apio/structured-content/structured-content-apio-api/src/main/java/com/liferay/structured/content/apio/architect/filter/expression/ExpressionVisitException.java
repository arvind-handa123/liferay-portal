/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.structured.content.apio.architect.filter.expression;

/**
 * Defines an exception for {@link ExpressionVisitor} to throw if an error
 * occurs while traversing the expression tree.
 *
 * @author Cristina González
 */
public class ExpressionVisitException extends Exception {

	/**
	 * Creates a new <code>ExpressionVisitException</code> with a message and a
	 * cause
	 *
	 * @param  msg - message of the Exception
	 * @review
	 */
	public ExpressionVisitException(String msg) {
		super(msg);
	}

	/**
	 * Creates a new {@code ExpressionVisitException} with a message and the
	 * cause of the exception.
	 *
	 * @param msg the message
	 * @param cause the cause
	 */
	public ExpressionVisitException(String msg, Throwable cause) {
		super(msg, cause);
	}

}
/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
 *
 ******************************************************************************/

package org.gromitsoft.server.filter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.logging.Logger;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

/**
 * Servlet response wrapper that can manipulate the output from a
 * the servlet chain.
 */
public class GenericResponseWrapper extends HttpServletResponseWrapper
{
    private static final Logger LOGGER = Logger.getLogger(GenericResponseWrapper.class.getName());

    private final ByteArrayOutputStream m_output;
    private int m_contentLength;
    private String m_contentType;

    /**
     * Create a new generic response wrapper
     * 
     * @param response the response to wrap
     */
    public GenericResponseWrapper(HttpServletResponse response)
    {
        super(response);
        m_output = new ByteArrayOutputStream();
    }

    @Override
    public PrintWriter getWriter()
    {
        return new PrintWriter(m_output);
    }

    @Override
    public void setContentLength(int length)
    {
        this.m_contentLength = length;
        super.setContentLength(length);
    }

    public int getContentLength()
    {
        return m_contentLength;
    }

    @Override
    public void setContentType(String type)
    {
        this.m_contentType = type;
        super.setContentType(type);
    }

    @Override
    public String getContentType()
    {
        return m_contentType;
    }

    @Override
    public String toString()
    {
        try {
            return m_output.toString("UTF-8");
        } catch (UnsupportedEncodingException uee) {
            LOGGER.throwing(GenericResponseWrapper.class.getName(), "toString", uee);
            return m_output.toString();
        }
    }

    @Override
    public ServletOutputStream getOutputStream()
        throws IOException
    {
        return new FilterServletOutputStream(m_output);
    }

}


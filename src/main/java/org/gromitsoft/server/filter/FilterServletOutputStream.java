/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
 *
 ******************************************************************************/
package org.gromitsoft.server.filter;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletOutputStream;

/**
 * Specialized ServletOutputStream, exposing functionality that will be utilized
 * by the filter response wrapper.
 */
public class FilterServletOutputStream extends ServletOutputStream
{
    private final DataOutputStream m_stream;

    /**
     * Create a new filter servlet outputstream
     * 
     * @param output the output stream to wrap
     */
    public FilterServletOutputStream(OutputStream output)
    {
        m_stream = new DataOutputStream(output);
    }

    @Override
    public void write(int b) throws IOException
    {
        m_stream.write(b);
    }

    @Override
    public void write(byte[] b) throws IOException
    {
        m_stream.write(b);
    }

    @Override
    public void write(byte[] b, int off, int len) throws IOException
    {
        m_stream.write(b, off, len);
    }

}


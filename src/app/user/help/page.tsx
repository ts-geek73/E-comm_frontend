'use client'

import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion"

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('faq')

  const faqData = [
    { question: 'How do I sign up?', answer: 'To sign up, click on the "Sign Up" button and fill in your details.' },
    // { question: 'How can I reset my password?', answer: 'You can reset your password by clicking on "Forgot Password" during login.' },  
    { question: 'Where can I view my profile?', answer: 'Go to your dashboard and click on your avatar to view your profile.' },
    // { question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, American Express, and PayPal.' },  
    { question: 'How do I contact customer support?', answer: 'You can contact customer support by clicking on the "Contact Us" button at the bottom of the page or by emailing support@example.com.' },
    { question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel your subscription at any time from your account settings.' },
  ]
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="bg-blue-200 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Help Center</h1>
          <p className="mt-2 text-lg text-gray-600">Find answers to your questions or contact support.</p>
        </div>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-md px-4 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`text-lg font-semibold py-2 px-4 rounded-lg ${activeTab === 'faq' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`text-lg font-semibold py-2 px-4 rounded-lg ${activeTab === 'contact' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
          >
            Contact Support
          </button>
        </div>

        {activeTab === 'contact' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Support</h3>
            <p className="text-gray-600 mb-4">If you need further assistance, please reach out to our support team.</p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Describe your issue"
                rows={4}
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {activeTab === 'faq' && (
          <>
              <Accordion type="single" collapsible className="flex flex-col items-center">
            {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className='w-1/2'>
                  <AccordionTrigger className='text-xl '>{faq.question}</AccordionTrigger>
                  <AccordionContent className='text-lg'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
          </>

        )}



      </div>
    </div>
  )
}

export default HelpPage

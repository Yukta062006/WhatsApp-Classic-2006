// Demo data for WhatsApp Classic 2006
// Pre-populates contacts, chats, messages and groups

export function getDemoChats(myId: string) {
  const contacts = [
    { id: "demo_sara", name: "Sara Khan", phone: "+92 300 1111111", status: "online", avatar: "", customStatus: "At College" },
    { id: "demo_bilal", name: "Bilal Ahmed", phone: "+92 301 2222222", status: "busy", avatar: "", customStatus: "In a meeting" },
    { id: "demo_hassan", name: "Hassan Ali", phone: "+92 302 3333333", status: "online", avatar: "", customStatus: "Gaming" },
    { id: "demo_mom", name: "Mom", phone: "+92 300 4444444", status: "online", avatar: "", customStatus: "" },
    { id: "demo_sana", name: "Sana Malik", phone: "+92 303 5555555", status: "away", avatar: "", customStatus: "BRB" },
    { id: "demo_zain", name: "Zain Raza", phone: "+92 304 6666666", status: "offline", avatar: "", customStatus: "" },
    { id: "demo_ayesha", name: "Ayesha Tariq", phone: "+92 305 7777777", status: "online", avatar: "", customStatus: "Happy vibes" },
    { id: "demo_usama", name: "Usama Sheikh", phone: "+92 306 8888888", status: "offline", avatar: "", customStatus: "" },
  ];

  const chats = [
    {
      _id: "chat_sara", participants: [{ _id: myId, name: "You" }, { _id: "demo_sara", name: "Sara Khan", status: "online", avatar: "" }],
      isGroup: false, lastMessage: { text: "Yes! Can you review the document?", createdAt: new Date(Date.now() - 120000).toISOString() }, updatedAt: new Date(Date.now() - 120000).toISOString()
    },
    {
      _id: "chat_bilal", participants: [{ _id: myId, name: "You" }, { _id: "demo_bilal", name: "Bilal Ahmed", status: "busy", avatar: "" }],
      isGroup: false, lastMessage: { text: "Bro check your email", createdAt: new Date(Date.now() - 600000).toISOString() }, updatedAt: new Date(Date.now() - 600000).toISOString()
    },
    {
      _id: "chat_hassan", participants: [{ _id: myId, name: "You" }, { _id: "demo_hassan", name: "Hassan Ali", status: "online", avatar: "" }],
      isGroup: false, lastMessage: { text: "GG bro!", createdAt: new Date(Date.now() - 1800000).toISOString() }, updatedAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      _id: "chat_mom", participants: [{ _id: myId, name: "You" }, { _id: "demo_mom", name: "Mom", status: "online", avatar: "" }],
      isGroup: false, lastMessage: { text: "Come home for dinner beta", createdAt: new Date(Date.now() - 3600000).toISOString() }, updatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: "chat_sana", participants: [{ _id: myId, name: "You" }, { _id: "demo_sana", name: "Sana Malik", status: "away", avatar: "" }],
      isGroup: false, lastMessage: { text: "Meeting at 3pm tomorrow?", createdAt: new Date(Date.now() - 7200000).toISOString() }, updatedAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: "chat_ayesha", participants: [{ _id: myId, name: "You" }, { _id: "demo_ayesha", name: "Ayesha Tariq", status: "online", avatar: "" }],
      isGroup: false, lastMessage: { text: "Haha that was funny", createdAt: new Date(Date.now() - 14400000).toISOString() }, updatedAt: new Date(Date.now() - 14400000).toISOString()
    },
    // Group chats
    {
      _id: "group_friends", participants: [
        { _id: myId, name: "You" }, { _id: "demo_sara", name: "Sara Khan", status: "online" },
        { _id: "demo_hassan", name: "Hassan Ali", status: "online" }, { _id: "demo_bilal", name: "Bilal Ahmed", status: "busy" },
        { _id: "demo_sana", name: "Sana Malik", status: "away" }
      ],
      isGroup: true, groupName: "Friends Forever", groupAdmin: myId,
      lastMessage: { text: "Who's coming tonight?", createdAt: new Date(Date.now() - 300000).toISOString() }, updatedAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      _id: "group_uni", participants: [
        { _id: myId, name: "You" }, { _id: "demo_bilal", name: "Bilal Ahmed", status: "busy" },
        { _id: "demo_ayesha", name: "Ayesha Tariq", status: "online" }, { _id: "demo_sana", name: "Sana Malik", status: "away" }
      ],
      isGroup: true, groupName: "University Buddies", groupAdmin: "demo_bilal",
      lastMessage: { text: "Assignment deadline extended!", createdAt: new Date(Date.now() - 5400000).toISOString() }, updatedAt: new Date(Date.now() - 5400000).toISOString()
    },
    {
      _id: "group_family", participants: [
        { _id: myId, name: "You" }, { _id: "demo_mom", name: "Mom", status: "online" }
      ],
      isGroup: true, groupName: "Family Group", groupAdmin: "demo_mom",
      lastMessage: { text: "Dinner at 8pm", createdAt: new Date(Date.now() - 9000000).toISOString() }, updatedAt: new Date(Date.now() - 9000000).toISOString()
    },
  ];

  return { contacts, chats };
}

export function getDemoMessages(myId: string) {
  const now = Date.now();
  return [
    // Sara chat
    { _id: "msg_s1", chat: "chat_sara", sender: { _id: myId, name: "You" }, text: "Hey Sara! How are you?", type: "text", createdAt: new Date(now - 600000).toISOString(), status: "read" },
    { _id: "msg_s2", chat: "chat_sara", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "I'm good Ali! Just working on my project. How about you?", type: "text", createdAt: new Date(now - 540000).toISOString(), status: "read" },
    { _id: "msg_s3", chat: "chat_sara", sender: { _id: myId, name: "You" }, text: "Same here! Need any help with the project?", type: "text", createdAt: new Date(now - 480000).toISOString(), status: "read" },
    { _id: "msg_s4", chat: "chat_sara", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "Yes! Can you review the document I sent?", type: "text", createdAt: new Date(now - 420000).toISOString(), status: "read" },
    { _id: "msg_s5", chat: "chat_sara", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "Project_Proposal.doc (250 KB)", type: "text", createdAt: new Date(now - 360000).toISOString(), status: "read" },
    { _id: "msg_s6", chat: "chat_sara", sender: { _id: myId, name: "You" }, text: "Sure! I'll look at it tonight", type: "text", createdAt: new Date(now - 300000).toISOString(), status: "delivered" },
    { _id: "msg_s7", chat: "chat_sara", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "Thank you so much! You're the best", type: "text", createdAt: new Date(now - 240000).toISOString(), status: "read" },
    { _id: "msg_s8", chat: "chat_sara", sender: { _id: myId, name: "You" }, text: "No problem! Talk later", type: "text", createdAt: new Date(now - 180000).toISOString(), status: "delivered" },
    { _id: "msg_s9", chat: "chat_sara", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "Yes! Can you review the document?", type: "text", createdAt: new Date(now - 120000).toISOString(), status: "read" },

    // Bilal chat
    { _id: "msg_b1", chat: "chat_bilal", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Bro did you finish the assignment?", type: "text", createdAt: new Date(now - 3600000).toISOString(), status: "read" },
    { _id: "msg_b2", chat: "chat_bilal", sender: { _id: myId, name: "You" }, text: "Almost done! Just the last 2 questions left", type: "text", createdAt: new Date(now - 3540000).toISOString(), status: "read" },
    { _id: "msg_b3", chat: "chat_bilal", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Nice. I'm stuck on Q5, any hints?", type: "text", createdAt: new Date(now - 3480000).toISOString(), status: "read" },
    { _id: "msg_b4", chat: "chat_bilal", sender: { _id: myId, name: "You" }, text: "Check page 47 of the textbook, it has the formula", type: "text", createdAt: new Date(now - 3420000).toISOString(), status: "read" },
    { _id: "msg_b5", chat: "chat_bilal", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Found it! Thanks man", type: "text", createdAt: new Date(now - 3360000).toISOString(), status: "read" },
    { _id: "msg_b6", chat: "chat_bilal", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Bro check your email", type: "text", createdAt: new Date(now - 600000).toISOString(), status: "read" },

    // Hassan chat
    { _id: "msg_h1", chat: "chat_hassan", sender: { _id: "demo_hassan", name: "Hassan Ali" }, text: "Yo! Counter Strike tonight?", type: "text", createdAt: new Date(now - 7200000).toISOString(), status: "read" },
    { _id: "msg_h2", chat: "chat_hassan", sender: { _id: myId, name: "You" }, text: "Yes! What time?", type: "text", createdAt: new Date(now - 7140000).toISOString(), status: "read" },
    { _id: "msg_h3", chat: "chat_hassan", sender: { _id: "demo_hassan", name: "Hassan Ali" }, text: "10 PM sharp. dust2 only!", type: "text", createdAt: new Date(now - 7080000).toISOString(), status: "read" },
    { _id: "msg_h4", chat: "chat_hassan", sender: { _id: myId, name: "You" }, text: "Lol okay I'll be there. Prepare to lose", type: "text", createdAt: new Date(now - 7020000).toISOString(), status: "read" },
    { _id: "msg_h5", chat: "chat_hassan", sender: { _id: "demo_hassan", name: "Hassan Ali" }, text: "Haha we'll see about that!", type: "text", createdAt: new Date(now - 6960000).toISOString(), status: "read" },
    { _id: "msg_h6", chat: "chat_hassan", sender: { _id: myId, name: "You" }, text: "GG bro!", type: "text", createdAt: new Date(now - 1800000).toISOString(), status: "delivered" },

    // Mom chat
    { _id: "msg_m1", chat: "chat_mom", sender: { _id: "demo_mom", name: "Mom" }, text: "Beta kahan ho?", type: "text", createdAt: new Date(now - 14400000).toISOString(), status: "read" },
    { _id: "msg_m2", chat: "chat_mom", sender: { _id: myId, name: "You" }, text: "University mein hoon Mom, class hai", type: "text", createdAt: new Date(now - 14340000).toISOString(), status: "read" },
    { _id: "msg_m3", chat: "chat_mom", sender: { _id: "demo_mom", name: "Mom" }, text: "Okay. Kab tak aao ge?", type: "text", createdAt: new Date(now - 14280000).toISOString(), status: "read" },
    { _id: "msg_m4", chat: "chat_mom", sender: { _id: myId, name: "You" }, text: "6 baje tak aa jaon ga InshaAllah", type: "text", createdAt: new Date(now - 14220000).toISOString(), status: "read" },
    { _id: "msg_m5", chat: "chat_mom", sender: { _id: "demo_mom", name: "Mom" }, text: "Come home for dinner beta", type: "text", createdAt: new Date(now - 3600000).toISOString(), status: "read" },
    { _id: "msg_m6", chat: "chat_mom", sender: { _id: myId, name: "You" }, text: "Ji Mom, coming soon!", type: "text", createdAt: new Date(now - 3540000).toISOString(), status: "delivered" },

    // Sana chat
    { _id: "msg_sn1", chat: "chat_sana", sender: { _id: "demo_sana", name: "Sana Malik" }, text: "Hi! Are you free tomorrow for the group project?", type: "text", createdAt: new Date(now - 18000000).toISOString(), status: "read" },
    { _id: "msg_sn2", chat: "chat_sana", sender: { _id: myId, name: "You" }, text: "Yeah I should be free after 2pm", type: "text", createdAt: new Date(now - 17940000).toISOString(), status: "read" },
    { _id: "msg_sn3", chat: "chat_sana", sender: { _id: "demo_sana", name: "Sana Malik" }, text: "Meeting at 3pm tomorrow?", type: "text", createdAt: new Date(now - 7200000).toISOString(), status: "read" },

    // Ayesha chat
    { _id: "msg_a1", chat: "chat_ayesha", sender: { _id: "demo_ayesha", name: "Ayesha Tariq" }, text: "Did you see what happened in class today?", type: "text", createdAt: new Date(now - 28800000).toISOString(), status: "read" },
    { _id: "msg_a2", chat: "chat_ayesha", sender: { _id: myId, name: "You" }, text: "Yes!! I couldn't believe it lol", type: "text", createdAt: new Date(now - 28740000).toISOString(), status: "read" },
    { _id: "msg_a3", chat: "chat_ayesha", sender: { _id: "demo_ayesha", name: "Ayesha Tariq" }, text: "Haha that was funny", type: "text", createdAt: new Date(now - 14400000).toISOString(), status: "read" },

    // Group: Friends Forever
    { _id: "msg_g1", chat: "group_friends", sender: { _id: "demo_hassan", name: "Hassan Ali" }, text: "Guys, pizza night tonight?", type: "text", createdAt: new Date(now - 1800000).toISOString(), status: "read" },
    { _id: "msg_g2", chat: "group_friends", sender: { _id: "demo_sara", name: "Sara Khan" }, text: "Yesss! I'm in!", type: "text", createdAt: new Date(now - 1740000).toISOString(), status: "read" },
    { _id: "msg_g3", chat: "group_friends", sender: { _id: myId, name: "You" }, text: "Count me in! What time?", type: "text", createdAt: new Date(now - 1680000).toISOString(), status: "delivered" },
    { _id: "msg_g4", chat: "group_friends", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "8 PM at the usual place?", type: "text", createdAt: new Date(now - 1620000).toISOString(), status: "read" },
    { _id: "msg_g5", chat: "group_friends", sender: { _id: "demo_sana", name: "Sana Malik" }, text: "Perfect! See you all there", type: "text", createdAt: new Date(now - 1560000).toISOString(), status: "read" },
    { _id: "msg_g6", chat: "group_friends", sender: { _id: "demo_hassan", name: "Hassan Ali" }, text: "Who's coming tonight?", type: "text", createdAt: new Date(now - 300000).toISOString(), status: "read" },

    // Group: University Buddies
    { _id: "msg_u1", chat: "group_uni", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Guys the prof extended the deadline!", type: "text", createdAt: new Date(now - 10800000).toISOString(), status: "read" },
    { _id: "msg_u2", chat: "group_uni", sender: { _id: "demo_ayesha", name: "Ayesha Tariq" }, text: "Thank God! I needed more time", type: "text", createdAt: new Date(now - 10740000).toISOString(), status: "read" },
    { _id: "msg_u3", chat: "group_uni", sender: { _id: myId, name: "You" }, text: "Same! When's the new deadline?", type: "text", createdAt: new Date(now - 10680000).toISOString(), status: "delivered" },
    { _id: "msg_u4", chat: "group_uni", sender: { _id: "demo_bilal", name: "Bilal Ahmed" }, text: "Assignment deadline extended! Next Friday now", type: "text", createdAt: new Date(now - 5400000).toISOString(), status: "read" },

    // Group: Family
    { _id: "msg_f1", chat: "group_family", sender: { _id: "demo_mom", name: "Mom" }, text: "Dinner at 8pm tonight. Don't be late!", type: "text", createdAt: new Date(now - 18000000).toISOString(), status: "read" },
    { _id: "msg_f2", chat: "group_family", sender: { _id: myId, name: "You" }, text: "Okay Mom! I'll be there", type: "text", createdAt: new Date(now - 17940000).toISOString(), status: "delivered" },
    { _id: "msg_f3", chat: "group_family", sender: { _id: "demo_mom", name: "Mom" }, text: "Dinner at 8pm", type: "text", createdAt: new Date(now - 9000000).toISOString(), status: "read" },
  ];
}

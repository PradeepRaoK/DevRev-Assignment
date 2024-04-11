import axios from "axios";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const run = async (events: any[]) => {
  const token = process.env.token;
  const owner = process.env.owner;
  // Creation of a workitem
  async function createTicket(title: string, body: string): Promise<string> {
    try {
      const data = {
        type: "issue",
        applies_to_part: "PROD-1",
        owned_by: [owner],
        title: title,
        body: body
      };

      const response = await axios.post('https://api.devrev.ai/works.create', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token // Replace with your actual access token
        }
      });

      console.log('New ticket created:', response.data);
      return response.data?.work?.id;
    } catch (error) {
      console.error('Error creating new ticket:', error);
      return "0";
    }
  }

  // Function to update the priority of a issue after creation of issue
  async function updateTicketPriority(id: string, priority: "p0" | "p1" | "p2" | "p3"): Promise<void> {
    try {
      const data = {
        type: "issue",
        id: id,
        priority: priority
      };

      const response = await axios.post('https://api.devrev.ai/works.update', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token // Replace with your actual access token
        }
      });

      console.log('Ticket priority updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating ticket priority:', error);
      return;
    }
  }

  // Function to get user input from the console
  async function getUserInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  // Get user input for ticket title and body
  const ticketTitle = await getUserInput("Enter issue title: ");
  const ticketBody = await getUserInput("Enter issue body: ");
  const ticketId = await createTicket(ticketTitle, ticketBody);
  
  if(ticketId!=="0"){
    const ticketPriority = (await getUserInput("Enter new priority (p0, p1, p2, p3): ")) as "p0" | "p1" | "p2" | "p3";
    await updateTicketPriority(ticketId, ticketPriority);
  } else {
    console.log("Failed to create ticket.Exiting...");
  }
}
export default run;

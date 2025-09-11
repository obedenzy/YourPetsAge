import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <i className="fas fa-paw text-primary-foreground text-sm"></i>
                </div>
                <span className="text-lg font-bold">Pet Age Translator</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Discover your pet's cosmic journey and connect with a community of pet lovers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/calculator" className="hover:text-primary transition-colors">Age Calculator</Link></li>
                <li><Link href="/premium" className="hover:text-primary transition-colors">Cosmic Reports</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Pet Profiles</Link></li>
                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="/premium" className="hover:text-primary transition-colors">AR Filters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/forums" className="hover:text-primary transition-colors">Forums</Link></li>
                <li><Link href="/meetups" className="hover:text-primary transition-colors">Meetups</Link></li>
                <li><Link href="/health" className="hover:text-primary transition-colors">Health Tips</Link></li>
                <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboards</Link></li>
                <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Achievements</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Pet Age Translator. Made with ❤️ for pet parents everywhere.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Medical disclaimer: This app is for entertainment and educational purposes only. 
              Always consult with a licensed veterinarian for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

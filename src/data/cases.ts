import type { CaseData } from '../types/index.ts';

export const CASES: Record<string, CaseData> = {
  'case-001': {
    id: 'case-001',
    code: 'BW-001-VANCE',
    title: 'The Midnight Lecture',
    subtitle: 'Professor Alistair Vance poisoned behind locked Victorian lecture hall doors.',
    victim: {
      name: 'Prof. Alistair Vance',
      title: 'Dean of Antiquities & Chair of Classical Philology',
      age: 58,
      causeOfDeath: 'Acute neurotoxic asphyxiation via Aconitine Alkaloid (Monkshood)',
      timeOfDeath: 'Estimated between 11:25 PM and 11:40 PM',
      foundLocation: 'St. Jude Hall, Podium Desk, West Wing',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    },
    location: 'St. Jude Lecture Hall, Blackwood University Quad',
    difficulty: 'Standard',
    estimatedTime: '25-35 mins',
    synopsis:
      'On a rainy Thursday night, the eccentric Dean of Antiquities was discovered dead at his lecture lectern. The heavy oak chamber door was locked from within with an antique deadbolt, while an amber cup of herbal tea rested near his cold hand. An heirloom brass pocket watch on his wrist was broken, stopped dead at 11:22 PM. But forensic pathologists whisper that 11:22 PM may be the most calculated deception in the university’s history.',
    autopsySummary:
      'Coroner Report #992-BLW: Toxicological screening revealed lethal concentrations of crystalline Aconitine (extract of Aconitum napellus / Wolfsbane) in gastric contents. Onset of ventricular arrhythmia and pulmonary paralysis: 15–25 minutes post-ingestion. Bruising along the victim’s right wrist suggests forceful manual restraint prior to cardiac arrest. The pocket watch escapement wheel had been manually forced backwards.',
    dispatchLog:
      '[23:48:12] 911 CAMPUS POLICE: Call received from Thomas Finch (Head Custodian). Caller agitated, reporting Professor Vance unresponsive at podium in St. Jude Hall.\n[23:52:04] Patrol Unit 4 arrives. Door forced open with hydraulic ram. Heavy scent of bitter almond and bergamot noted.\n[23:55:30] Paramedics confirm zero pulse, rigor mortis absent, pupils fixed.',
    crimeSceneDetails: [
      'Heavy solid oak door found secured with interior iron drop-bolt.',
      'Victorian transom window directly above the door was unlatched and tilted open 14 inches.',
      'Fine graphite scuff marks found on the iron maintenance pipes leading to the ceiling catwalk.',
      'Bone china teacup with Earl Grey tea residue and bitter plant alkaloid precipitate.',
      'Heirloom brass pocket watch with cracked crystal, frozen at 11:22 PM.',
      'Torn draft of an upcoming exposé titled "The Carthaginian Forgeries" scattered across the Persian rug.',
    ],
    crimeSceneHotspots: [
      {
        id: 'hs_desk',
        name: 'Podium Desk & Poisoned Tea Service',
        roomArea: 'Center Stage / Lecture Podium',
        xPercent: 50,
        yPercent: 52,
        briefClue: 'Porcelain cup with crystalline aconite sediment and stopped watch.',
        forensicObservation: 'Victim collapsed forward over lecture notes. An amber bone-china teacup shows dark sediment testing positive for concentrated monkshood extract. Wrist pocket watch crystal cracked at 11:22 PM, but mechanical escapement was forced manually.',
        discoveredDetail: 'Microscopic inspection of the watch hands revealed backward torsion scratches made with a specialized watchmaker key.',
        tiedEvidenceId: 'tea-cup',
        tiedSuspectName: 'Clara Oswald-Vance',
      },
      {
        id: 'hs_transom',
        name: 'Victorian Transom Window & Pipe Catwalk',
        roomArea: 'North Wall / Overhead Ventilation',
        xPercent: 24,
        yPercent: 22,
        briefClue: 'Tilted transom sash with graphite smudges and silk thread.',
        forensicObservation: 'The 14-inch transom window above the door was tilted on its brass pivot. Graphite marks on the adjacent heating pipe match soles of soft archival indoor slippers, not heavy outdoor boots.',
        discoveredDetail: 'A drop-bolt retrieval trick: a weighted silk cord was used to pull the deadbolt closed from outside after exiting.',
        tiedEvidenceId: 'window-latches',
      },
      {
        id: 'hs_manuscript',
        name: 'Dispersed Forgery Exposé Drafts',
        roomArea: 'Podium Floor / Persian Rug',
        xPercent: 62,
        yPercent: 68,
        briefClue: 'Typescript titled "The Carthaginian Forgeries" with handwritten margins.',
        forensicObservation: 'Seven typed pages detailing the fraudulent provenance of university manuscripts. Two specific scholars are named as collaborators in illicit antiquities sales.',
        discoveredDetail: 'Dr. Eleanor Gray’s monograph is crossed out with red ink: "Fabricated from whole cloth - Senate confrontation tomorrow."',
        tiedEvidenceId: 'forgery-draft',
        tiedSuspectName: 'Dr. Eleanor Gray',
      },
      {
        id: 'hs_elevator',
        name: 'Rear Archival Service Freight Gate',
        roomArea: 'East Vestibule / Rare Folio Access',
        xPercent: 82,
        yPercent: 78,
        briefClue: 'Electronic swipe terminal for the subterranean Rare Books vault.',
        forensicObservation: 'Heavy brass sliding grate leading directly to the temperature-controlled botanical archives. Card reader log records an access authorization at 11:15 PM.',
        discoveredDetail: 'Card 044 (issued to Clara Vance) used to ascend at 11:15 PM, contradicting her claim of staying locked in the vault until midnight.',
        tiedEvidenceId: 'keycard-logs',
        tiedSuspectName: 'Clara Oswald-Vance',
      },
      {
        id: 'hs_courtyard',
        name: 'West Quadrant Mud Beds & Exterior Drainage',
        roomArea: 'Courtyard Alleyway below Transom',
        xPercent: 16,
        yPercent: 80,
        briefClue: 'Heavy combat boot prints in wet sod and shattered amber beer glass.',
        forensicObservation: 'Multiple deep boot treads in garden soil beneath the drainpipe. Bottle fragments stamped with "The Black Boar Brewery".',
        discoveredDetail: 'Belongs to Julian Ward. However, the boot angle shows him pacing outside and kicking the door in frustration before leaving at 10:45 PM.',
        tiedEvidenceId: 'boot-prints',
        tiedSuspectName: 'Julian Ward',
      },
    ],
    suspects: [
      {
        id: 'eleanor-gray',
        name: 'Dr. Eleanor Gray',
        role: 'Rival Department Chair & Classical Scholar',
        department: 'Comparative Literature & Ancient Manuscripts',
        age: 52,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        summary:
          'A fiercely ambitious scholar whose landmark academic monograph was about to be discredited by Vance’s forthcoming exposé on forged papyri.',
        claimedAlibi:
          'Claims she remained in West Hall alone grading 40 postgraduate midterm exams from 10:00 PM until after midnight.',
        flaw:
          'Security gate turnstile records indicate her electronic badge was swiped OUT of West Hall at 10:48 PM and IN at 11:35 PM. Her monogrammed fountain pen was recovered in the St. Jude corridor.',
        motive:
          'Vance threatened to bring formal academic misconduct charges before the University Senate on Friday morning, which would result in her immediate dismissal and revocation of her tenure.',
        forensicTies: ['Monogrammed gold nib fountain pen found near St. Jude Hall', 'Contradicted badge swipe timestamps'],
        personality: 'Cold, fiercely articulate, intellectual superiority complex, easily agitated when her credentials are questioned.',
        temperament: 'Calm under polite questioning; turns aggressively haughty when confronted with security logs.',
        isSecretCulprit: false,
      },
      {
        id: 'julian-ward',
        name: 'Julian Ward',
        role: 'Disgraced Former PhD Candidate',
        department: 'Department of Ancient Languages',
        age: 28,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        summary:
          'Expelled three weeks ago by Vance for allegedly smuggling rare codices from the university vault. He was spotted drinking heavily around campus on the night of the murder.',
        claimedAlibi:
          'Insists he was drinking alone in the rear booth of "The Black Boar" tavern from 9:30 PM until closing time.',
        flaw:
          'The tavern bartender confirmed Julian stormed out in a drunken rage at 10:30 PM after reading a scathing email from Vance. Deep mud matching Julian’s combat boots was found beneath the hall exterior window.',
        motive:
          'Vance had blacklisted him from every academic institution in North America and threatened criminal prosecution.',
        forensicTies: ['Muddy boot prints matching tactical soles outside the St. Jude courtyard', 'Threatening voicemail timestamps on Vance’s phone'],
        personality: 'Nervous, prone to volatile outbursts, bitter, defensive, holds a burning grudge against institutional authority.',
        temperament: 'Sweats under pressure, raises voice, but crumbles quickly into emotional pleas.',
        isSecretCulprit: false,
      },
      {
        id: 'clara-vance',
        name: 'Clara Oswald-Vance',
        role: 'Estranged Wife & Chief University Archivist',
        department: 'Special Collections & Rare Folios Vault',
        age: 47,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        summary:
          'Curator of the university botanical and medieval folio vaults. Embroiled in an acrimonious divorce battle over a $2.2M Victorian estate and rare family manuscripts.',
        claimedAlibi:
          'Claims she spent the entire evening from 9:00 PM until 12:30 AM locked inside the climate-controlled Rare Folio Vault cataloging 17th-century herbal treatises.',
        flaw:
          'The volume she was logged as cataloging—Vol. IV of "Herbarius Latinus"—has its Wolfsbane / Aconitine chapter marked with fresh fingerprints. Her specialized archival master keycard was swiped to bypass the rear service elevator behind St. Jude Hall at 11:15 PM.',
        motive:
          'Vance had filed an emergency codicil removing her from his will and intended to report her to the Antiquities Commission for liquidating uncataloged artifacts to private collectors.',
        forensicTies: [
          'Access keycard logs for the private freight elevator at 11:15 PM',
          'Aconitine alkaloid matching specimens stored in her conservatory vault',
          'Watchmaker brass key tool found hidden in her vanity pouch',
        ],
        personality: 'Poised, refined, speaks with aristocratic poise, hides deadly calculation behind Victorian elegance.',
        temperament: 'Masks anxiety with cold politeness; loses composure when presented with physical toxicology links.',
        isSecretCulprit: true, // THE GUILTY PARTY
      },
      {
        id: 'thomas-finch',
        name: 'Thomas Finch',
        role: 'Head Custodian of Campus Facilities',
        department: 'Blackwood Physical Plant Services',
        age: 61,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        summary:
          'Veteran caretaker with 32 years on campus. Has keys to every chamber, padlock, and ventilation corridor in Blackwood University.',
        claimedAlibi:
          'Claims he was cleaning the subterranean library stacks and furnace room between 10:30 PM and 11:45 PM.',
        flaw:
          'The master faculty ring key for St. Jude Hall was missing from the wall board in the physical plant shop. Finch was the one who initially called in the discovery of the body at 11:45 PM.',
        motive:
          'Vance had caught Finch attempting to sell antique silver spoons and bronze fittings from the faculty lounge, giving him an ultimatum to retire or face disgrace.',
        forensicTies: ['Skeleton key ring found in his tool belt', 'Fabric fibers from his gray maintenance uniform on the outer hall doorknob'],
        personality: 'Weary, humble, speaks with a gravelly voice, superstitious about the university halls.',
        temperament: 'Quick to apologize, easily intimidated by badges, honest about his petty thefts when pressed.',
        isSecretCulprit: false,
      },
    ],
    evidence: [
      {
        id: 'pocket-watch',
        name: 'Victorian Pocket Watch',
        category: 'Physical',
        tagNumber: 'EVD-001-A',
        location: 'Victim’s Left Wrist',
        summary: 'Heirloom brass watch stopped at precisely 11:22 PM. Crystal glass cracked.',
        detailedAnalysis:
          'Microscopic inspection of the internal balance spring reveals manual mechanical interference: the minute gear was forcefully pulled backwards, stripping two brass gear teeth. The victim did NOT die at 11:22 PM; the hands were deliberately moved by the killer to establish an artificial alibi window prior to the real time of death (11:35 PM).',
        contradictsSuspectId: 'clara-vance',
        keyClue: true,
        iconName: 'Watch',
      },
      {
        id: 'toxicology-report',
        name: 'Coroner’s Toxicology Screen',
        category: 'Toxicology',
        tagNumber: 'EVD-001-B',
        location: 'St. Jude Lectern Teacup',
        summary: 'Lethal Aconitine crystals dissolved into Earl Grey tea infusion.',
        detailedAnalysis:
          'Aconitine alkaloid concentration measured at 4.2 mg/dL. This specific chemical purity can only be obtained through vacuum reflux distillation of live monkshood tubers—an apparatus available exclusively in the Blackwood University Botanical Conservatory Vault curated by Clara Oswald-Vance.',
        contradictsSuspectId: 'clara-vance',
        keyClue: true,
        iconName: 'FlaskConical',
      },
      {
        id: 'elevator-log',
        name: 'Service Elevator Telemetry Printout',
        category: 'Digital',
        tagNumber: 'EVD-001-C',
        location: 'Campus Security Mainframe',
        summary: 'Electronic keycard access record for Freight Elevator #2 behind St. Jude Hall.',
        detailedAnalysis:
          'Keycard ID #ARCH-8802 (issued to Clara Oswald-Vance) registered access to the St. Jude rear service mezzanine at 11:15 PM, returning down to the vault at 11:38 PM. Directly disproves her statement that she never left the underground vault.',
        contradictsSuspectId: 'clara-vance',
        keyClue: true,
        iconName: 'FileSpreadsheet',
      },
      {
        id: 'fountain-pen',
        name: 'Monogrammed Fountain Pen',
        category: 'Physical',
        tagNumber: 'EVD-001-D',
        location: 'St. Jude West Corridor Carpet',
        summary: '14k gold nib fountain pen engraved with the initials "E.G.".',
        detailedAnalysis:
          'Belongs to Dr. Eleanor Gray. Found 15 feet outside the locked lecture hall. Gray dropped it when Vance screamed at her to leave through the closed door around 11:00 PM, corroborating her physical presence in the hall but proving she did not enter the room.',
        contradictsSuspectId: 'eleanor-gray',
        keyClue: false,
        iconName: 'PenTool',
      },
      {
        id: 'muddy-boots',
        name: 'Forensic Cast of Soil Tread',
        category: 'Physical',
        tagNumber: 'EVD-001-E',
        location: 'Exterior Courtyard Flowerbed',
        summary: 'Deep mud depression beneath St. Jude Hall ground-floor window.',
        detailedAnalysis:
          'Tread geometry corresponds to size 10 British military surplus combat boots worn by Julian Ward. Heavy loam and crushed begonias indicate someone stood watching the window for approximately 10 minutes between 10:45 PM and 11:00 PM before fleeing.',
        contradictsSuspectId: 'julian-ward',
        keyClue: false,
        iconName: 'Footprints',
      },
      {
        id: 'skeleton-keys',
        name: 'Caretaker Master Key Ring',
        category: 'Physical',
        tagNumber: 'EVD-001-F',
        location: 'Custodial Lockbox & Finch’s Tool Pouch',
        summary: 'Heavy brass ring with 14 skeleton keys.',
        detailedAnalysis:
          'Tested against St. Jude Hall deadbolt. Key #4 operates the outer brass tumblers, but CANNOT bypass the internal manual drop-bolt from the outside when engaged. Finch could not have relocked the door from the outside had he killed Vance.',
        contradictsSuspectId: 'thomas-finch',
        keyClue: false,
        iconName: 'Key',
      },
      {
        id: 'dispatch-audio-tape',
        name: '911 Emergency Audio Recording',
        category: 'Audio/Document',
        tagNumber: 'EVD-001-G',
        location: 'Campus Police Dispatch Archive',
        summary: 'First responder call from Thomas Finch at 11:48 PM.',
        detailedAnalysis:
          'Voice stress analysis indicates genuine terror and heavy hyperventilation. Background acoustic echoes confirm Finch was shouting from the St. Jude Hall rotunda payphone.',
        audioSnippet: {
          duration: '0:42',
          transcript:
            '"Dispatcher, God Almighty, it’s Finch... in St. Jude Hall! The Professor... he’s slumped on the lectern! The cup’s spilled, his face is blue! The door was bolted from the inside, I had to climb the ladder to look through the transom! Send an ambulance, now!"',
        },
        keyClue: false,
        iconName: 'Mic',
      },
    ],
    timeline: [
      {
        time: '21:00',
        title: 'Vault Cataloging Begins',
        description: 'Clara Oswald-Vance signs into the Rare Folios Vault security register.',
        verified: true,
        source: 'Security desk visitor ledger',
      },
      {
        time: '22:15',
        title: 'Professor Vance Arrives',
        description: 'Vance enters St. Jude Hall with a satchel of manuscript papers and a private thermos.',
        verified: true,
        source: 'Quad security camera #2',
      },
      {
        time: '22:30',
        title: 'Tavern Dispute',
        description: 'Julian Ward storms out of The Black Boar pub after receiving an email from Vance.',
        verified: true,
        source: 'Bartender sworn affidavit',
      },
      {
        time: '22:48',
        title: 'Dr. Gray Departs West Hall',
        description: 'Gray swipes out of West Hall turnstiles and heads toward the Quad.',
        verified: true,
        source: 'Turnstile access mainframe',
      },
      {
        time: '23:00',
        title: 'Heated Exchange at Doorway',
        description: 'Gray knocks on Vance’s locked door, demanding retraction of the forgery accusations. Vance tells her to leave.',
        verified: true,
        source: 'Forensic pen drop & testimony',
      },
      {
        time: '23:15',
        title: 'Service Elevator Breach',
        description: 'Clara Oswald-Vance uses master keycard #ARCH-8802 to access the rear mezzanine behind the lecture hall.',
        verified: true,
        source: 'Elevator telemetry log',
      },
      {
        time: '23:20',
        title: 'Laced Tea Offered',
        description: 'Clara offers poisoned Earl Grey tea under guise of a late-night peace offering.',
        verified: false,
        source: 'Detective reconstruction',
      },
      {
        time: '23:35',
        title: 'Fatal Arrhythmia',
        description: 'Aconitine alkaloid triggers cardiovascular collapse. Watch hands manually wound back to 11:22 PM.',
        verified: true,
        source: 'Coroner autopsy & gear teeth damage',
      },
      {
        time: '23:48',
        title: 'Discovery of Body',
        description: 'Thomas Finch notices light under door, climbs maintenance ladder, and calls campus police.',
        verified: true,
        source: 'Dispatch audio recording',
      },
    ],
    weaponsList: [
      'Refined Aconitine Alkaloid (Monkshood Poison)',
      'Heavy Antique Brass Candlestick',
      'Chloroform Rag Asphyxiation',
      'Ceremonial Dagger from Antiquities Collection',
    ],
    contradictionsList: [
      'Keycard telemetry logged Clara at the St. Jude service elevator at 11:15 PM while claiming she never left the vault',
      'Dr. Gray claimed she was grading midterms in West Hall, but swiped out at 10:48 PM',
      'Julian Ward claimed he was drinking at the pub all night, but bartender stated he left at 10:30 PM',
      'Thomas Finch claimed he never had the key, but master ring was missing',
    ],
    motivesList: [
      'Impending divorce disinheritance and exposure of illegal artifact liquidation to private collectors',
      'Academic plagiarism exposure of the Carthaginian Codex monograph',
      'Vengeance for university expulsion and nationwide academic blacklisting',
      'Covering up petty custodial theft of silver lounge antiques',
    ],
    solution: {
      culpritId: 'clara-vance',
      culpritName: 'Clara Oswald-Vance',
      murderWeapon: 'Refined Aconitine Alkaloid (Monkshood Poison)',
      keyContradiction: 'Keycard telemetry logged Clara at the St. Jude service elevator at 11:15 PM while claiming she never left the vault',
      trueMotive: 'Impending divorce disinheritance and exposure of illegal artifact liquidation to private collectors',
      fullReenactment:
        'Clara Oswald-Vance planned the murder with surgical precision. Using the specialized extraction equipment in the conservatory vault, she isolated concentrated aconitine from monkshood plants. At 11:15 PM, using the quiet rear freight elevator, she slipped onto the St. Jude mezzanine. Known to Vance as his wife, he let her in. Under the pretext of discussing their divorce settlement calmly, she brewed him a hot Earl Grey tea containing the lethal dose. Once Vance succumbed to rapid paralysis, she engaged the heavy interior deadbolt, used a watchmaker key to wrench the brass pocket watch back to 11:22 PM (a time when she claimed to be in the vault), escaped through the high ventilation transom using the exterior maintenance ladder, and slipped back to her archives. She thought the locked-room illusion and false watch timestamp would guarantee her freedom and his fortune.',
      confessionTranscript:
        '"You think you’re so clever with your telemetry printouts and gear tooth analysis! Alistair was going to ruin me! Twenty-four years of suffering his cruel superiority, and he wanted to throw me out into the street with nothing! He deserved every bitter sip of that tea!"',
      redHerringExplanations: [
        {
          suspectName: 'Dr. Eleanor Gray',
          reasonNotGuilty:
            'Although Gray was furious about Vance’s exposé and went to his hall, Vance shouted at her through the locked oak door and she dropped her pen as she left in frustration. She never entered the room.',
        },
        {
          suspectName: 'Julian Ward',
          reasonNotGuilty:
            'Julian went to St. Jude Hall to beg or threaten Vance, but as he stood in the mud by the courtyard window, he saw a shadowed silhouette in a velvet coat on the balcony, got cold feet, and ran away in panic.',
        },
        {
          suspectName: 'Thomas Finch',
          reasonNotGuilty:
            'Finch is a petty thief who pawned silver tea spoons, but he admired Vance. He was merely doing his custodial rounds when he peeked through the transom and alerted the authorities.',
        },
      ],
    },
  },

  'case-002': {
    id: 'case-002',
    code: 'BW-002-LIN',
    title: 'The Last Submission',
    subtitle: 'Brilliant postgraduate Maya Lin found asphyxiated in the subterranean Turing Annex.',
    victim: {
      name: 'Maya Lin',
      title: 'Postgraduate Fellow in Quantum Machine Learning',
      age: 23,
      causeOfDeath: 'Acute Halon / Inert Gas Asphyxiation with door maglock override',
      timeOfDeath: 'Estimated between 2:40 AM and 3:00 AM',
      foundLocation: 'Turing Computing Annex, Server Room 4B',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    location: 'Turing Computing Annex, Basement Level 2',
    difficulty: 'Challenging',
    estimatedTime: '30-40 mins',
    synopsis:
      'With only 45 minutes remaining before the midnight deadline of the coveted $250,000 Turing Innovation Grant, prodigy researcher Maya Lin was discovered dead inside the hermetically sealed Server Room 4B. The emergency Halon fire suppression system had flooded the room with inert gas, while the magnetic door lock was held shut by an administrative override. Her proprietary model weights had been wiped from the mainframe.',
    autopsySummary:
      'Coroner Report #1041-BLW: Severe cerebral hypoxia caused by rapid displacement of oxygen by Halon 1301/nitrogen gas mix. Bruising on palms and fingernails consistent with frantic pounding against reinforced polycarbonate security glass. Time of death placed between 2:42 AM and 2:55 AM.',
    dispatchLog:
      '[03:15:22] CAD ALERT: Fire suppression discharge alarm triggered in Turing Computing Annex Server Cluster B.\n[03:21:10] Campus Security arrives on scene. Room filled with dense inert fog. Manual emergency exhaust lever pulled.\n[03:26:00] Victim discovered slumped behind rack 14; terminal display flashing "ZERO OVERWRITE COMPLETE".',
    crimeSceneDetails: [
      'Server Room 4B magnetic door lock engaged via software override from an administrative terminal.',
      'Manual Halon dump actuator pulled inside the server vestibule.',
      'Maya Lin’s primary encrypted NVMe SSD drive unscrewed and missing from the computing cluster.',
      'A discarded coffee cup with trace lipstick and cold espresso on the console desk.',
      'Network console logged a secure shell (SSH) connection originating from outside the university.',
      'Emergency door intercom wires cleanly severed with copper wire cutters.',
    ],
    crimeSceneHotspots: [
      {
        id: 'hs_rack14',
        name: 'Cluster Rack 14 & Model Wiping Terminal',
        roomArea: 'Core Server Bay 4B',
        xPercent: 50,
        yPercent: 48,
        briefClue: 'Terminal screen cycling "ZERO OVERWRITE EXECUTED - 2:42 AM".',
        forensicObservation: 'Victim found collapsed beside GPU chassis 14. The internal SSD drive was cleanly unscrewed with a precision torx bit. The system wipe command was issued through a sudo session using token root-0x498.',
        discoveredDetail: 'Token root-0x498 belongs exclusively to the lab director, Dr. Sanjay Rao, logged into from the director’s suite.',
        tiedEvidenceId: 'turing-override',
        tiedSuspectName: 'Dr. Sanjay Rao',
      },
      {
        id: 'hs_halon',
        name: 'Halon 1301 Inert Gas Dump Solenoid',
        roomArea: 'North Safety Vestibule',
        xPercent: 80,
        yPercent: 26,
        briefClue: 'Manual safety pin removed and discharge solenoid activated remotely.',
        forensicObservation: 'The 400-pound cylinder discharged completely within 18 seconds, displacing all breathable oxygen with nitrogen/halon. The physical safety pin was bypassed by an administrative software trigger.',
        discoveredDetail: 'Discharge was scheduled at 2:40 AM with a 10-second silent countdown; intercom warning was disabled.',
        tiedEvidenceId: 'halon-canister',
      },
      {
        id: 'hs_maglock',
        name: 'Heavy Magnetic Door & Polycarbonate Vision Panel',
        roomArea: 'Main Exit Airlock',
        xPercent: 22,
        yPercent: 72,
        briefClue: 'Emergency push bar locked by electrical hold; handprints on glass.',
        forensicObservation: 'High-strength 1,200 lb electromagnetic lock received continuous hold signal. Fingerprints and palm sweat on interior glass confirm desperate attempts to escape while gas flooded the chamber.',
        discoveredDetail: 'The exterior card reader was intentionally disabled via circuit cutoff behind the drywall.',
        tiedEvidenceId: 'turing-override',
      },
      {
        id: 'hs_console',
        name: 'Vestibule Console & Cut Intercom Cables',
        roomArea: 'Administrative Observation Desk',
        xPercent: 74,
        yPercent: 70,
        briefClue: 'Copper intercom wires cleanly snipped; espresso cup with lipstick.',
        forensicObservation: 'The two-way security talkback unit was severed with miniature diagonal cutters. Forensic lab matches the copper shear striations to toolmarks in the director’s workbench.',
        discoveredDetail: 'Espresso cup traces match lipstick brand worn by Chloe Bennett, who admitted visiting earlier to plead for research attribution.',
        tiedEvidenceId: 'severed-intercom',
      },
      {
        id: 'hs_exhaust',
        name: 'Sub-Basement Utility Chute & Key Fob Scanner',
        roomArea: 'Rear Emergency Stairwell',
        xPercent: 28,
        yPercent: 24,
        briefClue: 'Electronic fob badge swipe log and wet yellow sneaker smudges.',
        forensicObservation: 'Basement fire door logged access at 2:20 AM and 2:48 AM. Security camera in the tunnel captured distinct yellow sneakers matching Chloe Bennett fleeing towards the quad.',
        discoveredDetail: 'Fob registered to security guard Marcus Hayes was used to prop open the exterior service gate at 2:20 AM.',
        tiedEvidenceId: 'keycard-fob',
        tiedSuspectName: 'Marcus Hayes',
      },
    ],
    suspects: [
      {
        id: 'sanjay-rao',
        name: 'Dr. Sanjay Rao',
        role: 'Lab Director & Chair of Computing Sciences',
        department: 'Artificial Intelligence & Quantum Algorithms Lab',
        age: 54,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        summary:
          'Maya’s principal academic advisor and lab director. Secured millions in private industry funding through his lab’s proprietary patents.',
        claimedAlibi:
          'Claims he was participating in an international video conference call with Japanese venture partners from his 3rd floor office between 1:00 AM and 3:30 AM.',
        flaw:
          'Tokyo partners confirmed the Zoom call was muted with video turned off between 2:15 AM and 3:00 AM due to "technical bandwidth issues". The Halon environmental control override was logged from his office terminal at 2:42 AM.',
        motive:
          'Maya had scheduled an emergency whistleblower meeting with the University Ethics Board for 9:00 AM to present evidence that Dr. Rao had secretly licensed her doctoral patent to a defense contractor under his sole name, pocketing $800,000 in kickbacks.',
        forensicTies: [
          'Environmental override executed using master root admin token issued exclusively to Dr. Rao',
          'Tokyo Zoom conference audio telemetry showing 45-minute silent drop',
          'Wire cutter scratches matching tool kit in Rao’s private lab drawer',
        ],
        personality: 'Charismatic, politically connected, authoritatively dismissive of student complaints, obsessed with institutional prestige.',
        temperament: 'Smooth and polite initially; becomes vindictive and arrogant when his integrity is attacked.',
        isSecretCulprit: true, // THE GUILTY PARTY
      },
      {
        id: 'ethan-sterling',
        name: 'Ethan Sterling',
        role: 'Peer Competitor & Trustee’s Son',
        department: 'Distributed Systems & Blockchain Fellow',
        age: 24,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
        summary:
          'The wealthy runner-up for the Turing Grant. His AI startup had promised investors a revolutionary compression model, but Maya’s algorithm consistently outperformed his.',
        claimedAlibi:
          'Claims he completed his grant submission at 11:00 PM from his downtown luxury loft and went straight to sleep.',
        flaw:
          'Network telemetry logs reveal an SSH session to the campus server initiated at 2:38 AM from a hardware MAC address registered to Ethan’s custom gold-edition MacBook Pro via campus VPN.',
        motive:
          'His startup faced imminent collapse and fraud investigations if he failed to win the $250,000 grant and publish the lead benchmark.',
        forensicTies: ['MAC address VPN login records at 2:38 AM', 'Wiped git repository logs traced to his stolen SSH key'],
        personality: 'Entitled, defensive, fast-talking, accustomed to buying his way out of difficulties.',
        temperament: 'Aggressively threatens to call his father’s legal team; panics when presented with MAC address proofs.',
        isSecretCulprit: false,
      },
      {
        id: 'chloe-bennett',
        name: 'Chloe Bennett',
        role: 'Roommate & Secondary Project Contributor',
        department: 'Applied Mathematics & Machine Learning',
        age: 23,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        summary:
          'Maya’s roommate who assisted in data preprocessing. Bitter that Maya refused to list her as co-author on the grant application.',
        claimedAlibi:
          'Claims she went to sleep in their shared dorm room at Hawthorne House at midnight after a migraine.',
        flaw:
          'Quad security cameras recorded a figure in Chloe’s identifiable yellow sneakers and oversized black hoodie entering the Turing Annex at 1:45 AM. Maya’s encrypted backup thumb drive was found hidden in Chloe’s dorm locker.',
        motive:
          'Felt her intellectual contributions were being exploited; wanted to extract the raw neural weights to submit her own independent thesis.',
        forensicTies: ['Maya’s encrypted USB drive found in her personal locker', 'Security camera capture in the basement hallway at 1:45 AM'],
        personality: 'Quiet, emotionally fragile, deeply anxious, speaks in hushed tones.',
        temperament: 'Breaks down quickly into tears; confesses immediately to theft while vehemently denying violence.',
        isSecretCulprit: false,
      },
      {
        id: 'marcus-hayes',
        name: 'Marcus Hayes',
        role: 'Night Network Administrator & Security Officer',
        department: 'Blackwood Information Security Operations',
        age: 39,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
        summary:
          'Contract night admin with full badge access to the server farm. Heavily in debt from online sports betting.',
        claimedAlibi:
          'Claims he spent the shift between 1:30 AM and 3:30 AM in the campus electrical substation resolving a fiber optical switch loop.',
        flaw:
          'His electronic access fob was registered at the Server Room 4B fire escape stairway at 2:20 AM.',
        motive:
          'Was offered $50,000 in cryptocurrency by an anonymous external competitor to install a hardware keystroke packet sniffer onto Maya’s compute cluster.',
        forensicTies: ['Hardware packet sniffer dongle found in his vest pocket', 'Electronic fob log at the stairwell'],
        personality: 'Cynical, street-smart, speaks in terse tech jargon, guarded.',
        temperament: 'Maintains stony indifference; flips when shown security footage and gives up witness details.',
        isSecretCulprit: false,
      },
    ],
    evidence: [
      {
        id: 'admin-terminal-log',
        name: 'Halon Suppression Override Audit Log',
        category: 'Digital',
        tagNumber: 'EVD-002-A',
        location: 'Turing Facility Mainframe',
        summary: 'Server telemetry recording manual Halon gas trigger and magnetic door interlock.',
        detailedAnalysis:
          'At 2:42 AM, root admin account "ROOT-DIR-RAO" issued command: ENV_OVERRIDE_LOCKDOWN --suppression=HALON_DUMP --maglock=ENFORCE_SHUT. The command originated from the hardwired IP address assigned exclusively to Dr. Sanjay Rao’s private 3rd-floor office terminal.',
        contradictsSuspectId: 'sanjay-rao',
        keyClue: true,
        iconName: 'Server',
      },
      {
        id: 'zoom-log',
        name: 'Tokyo Venture Conference Call Telemetry',
        category: 'Digital',
        tagNumber: 'EVD-002-B',
        location: 'Zoom Enterprise Cloud Server',
        summary: 'Bandwidth and audio packet activity log for Dr. Rao’s meeting.',
        detailedAnalysis:
          'Between 2:15 AM and 3:00 AM, Dr. Rao’s audio stream sent zero packets (microphone hardware muted), and video output was a frozen still photograph. The participants in Tokyo were reviewing slide decks while Rao was physically absent from his desk.',
        contradictsSuspectId: 'sanjay-rao',
        keyClue: true,
        iconName: 'Video',
      },
      {
        id: 'vpn-mac-log',
        name: 'Campus VPN Remote Shell Telemetry',
        category: 'Digital',
        tagNumber: 'EVD-002-C',
        location: 'Firewall Audit Logs',
        summary: 'Inbound SSH connection using Maya’s stolen credentials.',
        detailedAnalysis:
          'Connected at 2:38 AM and executed "rm -rf /models/checkpoint_final.pt". The hardware MAC address matches Ethan Sterling’s registered 16-inch MacBook Pro, proving digital sabotage but confirming he was connected remotely over the residential fiber network.',
        contradictsSuspectId: 'ethan-sterling',
        keyClue: false,
        iconName: 'ShieldAlert',
      },
      {
        id: 'encrypted-drive',
        name: 'Stolen Backup Thumb Drive',
        category: 'Physical',
        tagNumber: 'EVD-002-D',
        location: 'Chloe Bennett’s Locker (Dorm)',
        summary: 'High-speed 2TB SSD with Maya’s handwritten label "Preprint Data - Maya & Chloe".',
        detailedAnalysis:
          'Timestamp of last file copy is 1:52 AM. Chloe sneaked into the lab, copied the raw training set, argued with Maya, and left with the drive. Maya was still very much alive and well at 2:05 AM when Chloe exited.',
        contradictsSuspectId: 'chloe-bennett',
        keyClue: false,
        iconName: 'HardDrive',
      },
      {
        id: 'stairwell-badge',
        name: 'Stairwell Fob Access Telemetry',
        category: 'Digital',
        tagNumber: 'EVD-002-E',
        location: 'Access Control Database',
        summary: 'Marcus Hayes’s security fob logged at the server room rear fire escape at 2:20 AM.',
        detailedAnalysis:
          'Marcus went downstairs to plant a hardware sniffer for crypto bounties, but when he heard angry raised voices inside the lab at 2:35 AM, he got cold feet and retreated to the roof stairwell.',
        contradictsSuspectId: 'marcus-hayes',
        keyClue: false,
        iconName: 'Cpu',
      },
      {
        id: 'ethics-draft',
        name: 'Whistleblower Email Draft',
        category: 'Documentary',
        tagNumber: 'EVD-002-F',
        location: 'Victim’s Cloud Drafts Folder',
        summary: 'Formal notice addressed to University Ethics Committee & General Counsel.',
        detailedAnalysis:
          'Maya wrote: "Dr. Rao has forged patent reassignment forms for the Helios Neural Core. If this is not addressed by 9:00 AM Friday, I will release the cryptographic git hashes to the public and federal sponsors."',
        contradictsSuspectId: 'sanjay-rao',
        keyClue: true,
        iconName: 'Mail',
      },
      {
        id: 'cad-audio-call',
        name: 'Security Guard Radio Transmission',
        category: 'Audio/Document',
        tagNumber: 'EVD-002-G',
        location: 'Campus Security Incident Desk',
        summary: 'Audio dispatch at 3:18 AM upon entering Server Room 4B.',
        detailedAnalysis:
          'First responding officer describes dense gas discharge and the magnetic lockdown status.',
        audioSnippet: {
          duration: '0:35',
          transcript:
            '"Control, this is Patrol 2! We’re at Turing Annex 4B! The Halon system has completely discharged! The maglock on the door is jammed shut via administrative override—we can’t break the seal! Someone trapped her inside!"',
        },
        keyClue: false,
        iconName: 'Radio',
      },
    ],
    timeline: [
      {
        time: '01:00',
        title: 'Tokyo Zoom Conference Commences',
        description: 'Dr. Sanjay Rao starts video conference call with Tokyo venture capital partners from his office.',
        verified: true,
        source: 'Zoom connection logs',
      },
      {
        time: '01:45',
        title: 'Chloe Bennett Enters Annex',
        description: 'Chloe Bennett enters basement quad in dark hoodie to retrieve training datasets.',
        verified: true,
        source: 'Quad surveillance camera #4',
      },
      {
        time: '01:52',
        title: 'Heated Argument in Lab',
        description: 'Maya catches Chloe copying data; Chloe storms out crying, leaving Maya alive.',
        verified: true,
        source: 'Chloe’s statement & USB timestamp',
      },
      {
        time: '02:15',
        title: 'Dr. Rao Mutes Zoom Stream',
        description: 'Dr. Rao mutes microphone and turns off camera on Tokyo call, claiming bandwidth trouble.',
        verified: true,
        source: 'Zoom Enterprise audio telemetry',
      },
      {
        time: '02:20',
        title: 'Marcus Hayes at Stairwell',
        description: 'Marcus Hayes reaches basement stairwell with packet sniffer but hesitates.',
        verified: true,
        source: 'Electronic fob log',
      },
      {
        time: '02:38',
        title: 'Remote SSH Code Sabotage',
        description: 'Ethan Sterling logs in via VPN from his penthouse to erase Maya’s remote git checkpoint.',
        verified: true,
        source: 'Campus firewall MAC address log',
      },
      {
        time: '02:42',
        title: 'Halon Suppression Discharge',
        description: 'Administrative terminal override triggers Halon dump and locks magnetic doors.',
        verified: true,
        source: 'Server Room 4B environmental audit log',
      },
      {
        time: '03:00',
        title: 'Dr. Rao Reconnects Zoom Video',
        description: 'Rao returns to office desk, unmutes audio, and finishes Tokyo conference call.',
        verified: true,
        source: 'Zoom Enterprise video log',
      },
      {
        time: '03:15',
        title: 'Security Responds to Alarm',
        description: 'Automated environmental alert summons campus security to Server Room 4B.',
        verified: true,
        source: 'CAD Incident Report',
      },
    ],
    weaponsList: [
      'Halon 1301 / Nitrogen Fire Suppression Override with Magnetic Door Seal',
      'High-Voltage Electrical Capacitor Discharge',
      'Carbon Monoxide Infiltration via Air Vent',
      'Direct Blunt Force Trauma with Server Rack Rail',
    ],
    contradictionsList: [
      'Dr. Rao claimed he was speaking on a Tokyo Zoom call, but audio telemetry showed zero sound and muted feed from 2:15 AM to 3:00 AM while override command came from his office IP',
      'Ethan Sterling claimed he was asleep, but VPN MAC logs showed his MacBook executing remote wipe commands at 2:38 AM',
      'Chloe Bennett claimed she was in her dorm all night, but security cameras caught her entering the quad at 1:45 AM',
      'Marcus Hayes claimed he was in the substation, but his fob was swiped at the stairwell at 2:20 AM',
    ],
    motivesList: [
      'Silencing an impending 9:00 AM whistleblower exposé regarding $800,000 patent embezzlement and corporate theft',
      'Stealing proprietary neural compression weights to save an AI startup from investor bankruptcy',
      'Jealousy over stolen co-authorship and academic thesis credit',
      'Collecting a $50,000 corporate espionage cryptocurrency bounty',
    ],
    solution: {
      culpritId: 'sanjay-rao',
      culpritName: 'Dr. Sanjay Rao',
      murderWeapon: 'Halon 1301 / Nitrogen Fire Suppression Override with Magnetic Door Seal',
      keyContradiction:
        'Dr. Rao claimed he was speaking on a Tokyo Zoom call, but audio telemetry showed zero sound and muted feed from 2:15 AM to 3:00 AM while override command came from his office IP',
      trueMotive:
        'Silencing an impending 9:00 AM whistleblower exposé regarding $800,000 patent embezzlement and corporate theft',
      fullReenactment:
        'Dr. Sanjay Rao discovered Maya’s drafted whistleblower email to the University Ethics Board on the shared lab drive earlier that evening. If Maya submitted her evidence at 9:00 AM, his lucrative corporate consulting empire, tenure, and freedom would be destroyed. During his scheduled Tokyo video conference, he intentionally muted his microphone, switched off his camera under the guise of bandwidth degradation, and walked down to the basement server farm. Entering Server Room 4B, he confronted Maya. When she refused to surrender her cryptographic keys, Rao stepped outside, severed the emergency intercom wires, and used his master administrative credentials to lock the heavy magnetic door and trigger the high-velocity Halon gas discharge. He watched through the reinforced glass as oxygen was displaced within seconds. He then calmly returned to his 3rd-floor office, unmuted his Zoom call at 3:00 AM, and concluded his business with Tokyo, believing he had fabricated the flawless digital alibi.',
      confessionTranscript:
        '"She was going to destroy everything! Ten years of building this department, ten million dollars in private grants! Maya was just a student—she didn’t understand the compromises necessary to fund real science! The code belonged to my lab, not her! She brought this on herself!"',
      redHerringExplanations: [
        {
          suspectName: 'Ethan Sterling',
          reasonNotGuilty:
            'Ethan is a digital thief who remotely wiped Maya’s git repository from his luxury penthouse to stop her from winning the grant. He committed industrial sabotage, but he was never on campus that night.',
        },
        {
          suspectName: 'Chloe Bennett',
          reasonNotGuilty:
            'Chloe snuck in at 1:45 AM to take the raw dataset because she felt exploited as an uncredited student. After an emotional argument with Maya, Chloe fled in tears at 2:05 AM, leaving Maya alive.',
        },
        {
          suspectName: 'Marcus Hayes',
          reasonNotGuilty:
            'Marcus was bribed to plant a packet sniffer, but when he arrived outside the server room at 2:20 AM and heard tensions inside, he got cold feet and hid on the roof until alarms blared.',
        },
      ],
    },
  },
};
